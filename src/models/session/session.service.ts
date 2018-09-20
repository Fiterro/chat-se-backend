import { Inject, Injectable } from "@nestjs/common";
import { Sequelize, Transaction } from "sequelize";
import { RedisClient } from "redis";
import { Observable, Subject } from "rxjs";

import {config} from "../../../config";
import { ISessionService } from "../../interfaces/session-service.interface";
import { REDIS_REPOS, REDIS_TOKEN, SEQUELIZE_TOKEN } from "../../app.constants";
import { SessionEntity } from "./session.entity";
import { IRedisWrapper } from "../../interfaces/redis-wrapper.interface";
import { RedisWrapper } from "../../classes/redis-wrapper";
import { StringComposer } from "../../utils/string-composer";
import { CryptoManager } from "../../utils/crypto-manager";
import { SessionDto } from "../../dto/session.dto";
import { UserSessionDto } from "../../dto/user-session.dto";

// TODO: probably move interfaces into proper folder
interface SessionTokens {
    accessToken: string;
    refreshToken: string;
}

interface CachedSession {
    sessionId: number;
    userId: number;
}

interface SessionOptions {
    lifeTime?: number;
}

type FullSession = SessionTokens & CachedSession & { lifeTime: number };

@Injectable()
export class SessionService implements ISessionService<any> {
    private readonly redisClient: IRedisWrapper;
    private readonly destroyedSessionsEmitter = new Subject<number[]>();

    constructor(@Inject(REDIS_TOKEN) private readonly redis: RedisClient,
                @Inject(REDIS_REPOS.SESSION) private readonly sessions: typeof SessionEntity,
                @Inject(SEQUELIZE_TOKEN) private readonly dbConnection: Sequelize) {
        this.redisClient = new RedisWrapper(redis);
    }

    get afterDestroyed(): Observable<number[]> {
        return this.destroyedSessionsEmitter.asObservable();
    }

    static getUserAppendix(userId: number): string {
        return StringComposer.createKey("user", userId);
    }

    static getSessionAppendix(sessionId: number): string {
        return StringComposer.createKey("session", sessionId);
    }

    async destroyAllSessions(userId: number, transaction?: Transaction): Promise<void> {
        const currentSessions = await this.sessions.findAll({
            where: {userId},
            transaction,
        });

        if (currentSessions.length) {
            // find all user's sessions
            const sessions = currentSessions.map((s) => SessionService.getSessionAppendix(s.id));
            const tokens: string[] = [];
            // find all access tokens that belong to the sessions
            for (const session of sessions) {
                tokens.push(...await this.redisClient.smembers(session));
            }
            // remove all session data cached in Redis
            await this.redisClient.del(...sessions, ...tokens);
            this.destroyedSessionsEmitter.next(currentSessions.map((s) => s.id));
            await this.sessions.destroy({
                where: {userId},
                transaction,
            });
        }
    }

    async create(userId: number, sessionOptions?: SessionOptions): Promise<SessionDto> {
        const transaction = await this.dbConnection.transaction();
        try {
            // destroy all previously created session
            await this.destroyAllSessions(userId, transaction);

            // generate new refresh token for session
            const refreshToken = CryptoManager.genToken(userId, "refreshToken");

            // create session record in database
            const session = await this.sessions.create(
                {userId, refreshToken},
                {transaction},
            );

            const fullSession = await this.storeSession(session, sessionOptions);
            await transaction.commit();

            return new SessionDto(fullSession.accessToken, fullSession.refreshToken, fullSession.lifeTime);
        } catch (exception) {
            await transaction.rollback();
            throw exception;
        }
    }

    async storeSession(session: SessionEntity, options?: SessionOptions): Promise<FullSession> {
        const accessToken = CryptoManager.genToken(session.userId, config.jwtKey);
        const lifeTime = options ? options.lifeTime : config.jwtLifeTime;

        const data: CachedSession = {
            sessionId: session.id,
            userId: session.userId,
        };

        await this.redisClient.set(accessToken, JSON.stringify(data), lifeTime);
        await this.redisClient.sadd(SessionService.getSessionAppendix(session.id), accessToken);

        return {
            lifeTime,
            accessToken,
            sessionId: session.id,
            userId: session.userId,
            refreshToken: session.refreshToken,
        };
    }

    async findSession(accessToken: string): Promise<UserSessionDto | null> {
        const cachedSession = JSON.parse(await this.redisClient.get(accessToken)) as CachedSession;

        if (!cachedSession) {
            return null;
        }

        return new UserSessionDto(cachedSession.userId, cachedSession.sessionId);
    }

    async destroy(sessionId: number): Promise<void> {
        const transaction = await this.dbConnection.transaction();
        try {
            await this.sessions.destroy({where: {id: sessionId}, transaction});
            const session = SessionService.getSessionAppendix(sessionId);
            const tokens: string[] = [];
            // find all access tokens that belong to the sessions
            tokens.push(...await this.redisClient.smembers(session));
            // remove all session data cached in Redis
            await this.redisClient.del(...tokens, session);
            await transaction.commit();
            this.destroyedSessionsEmitter.next([sessionId]);
        } catch (exception) {
            await transaction.rollback();
            throw exception;
        }
    }

    async refresh(session: SessionEntity): Promise<SessionDto> {
        const fullSession = await this.storeSession(session);
        return new SessionDto(fullSession.accessToken, fullSession.refreshToken, fullSession.lifeTime);
    }
}