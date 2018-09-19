import { Inject, Injectable, MiddlewareFunction, NestMiddleware } from "@nestjs/common";
import { Request } from "express";

import { ISessionService } from "../../interfaces/session-service.interface";
import { SESSION_SERVICE_TOKEN } from "../../app.constants";
import { IExtendedRequest } from "../../interfaces/extended-request.interface";

const AUTHORIZATION = "Authorization";
const BEARER_TOKEN = /Bearer ([^\s]+)/;

@Injectable()
export class SessionMiddleware<T> implements NestMiddleware {

    constructor(@Inject(SESSION_SERVICE_TOKEN) private readonly sessionService: ISessionService<T> | ISessionService<T>[]) {
    }

    static getAccessToken(request: Request): string | null {
        const value = request.get(AUTHORIZATION);
        if (value) {
            const match = value.match(BEARER_TOKEN);

            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    }

    resolve(): MiddlewareFunction | Promise<MiddlewareFunction> {
        return async (request: IExtendedRequest, response: Response, next: (error?: any) => void) => {
            if (request.session) {
                return next();
            }

            const token = SessionMiddleware.getAccessToken(request);

            if (!token) {
                return next();
            }

            if (this.sessionService instanceof Array) {
                for (const service of this.sessionService) {
                    const session = await service.findSession(token);

                    if (session) {
                        request.session = session;
                        break;
                    }
                }
            } else {
                request.session = await this.sessionService.findSession(token);
            }
            next();
        };
    }
}