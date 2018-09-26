import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    NotFoundException,
    Post,
    Req,
    Res,
    Session,
    UnprocessableEntityException,
    UseGuards,
} from "@nestjs/common";

import { SessionService } from "./session.service";
import { AuthService } from "../auth/auth.service";
import { User } from "../user/user.entity";
import { SessionDataDto } from "../../dto/session-data.dto";
import { AllowSessions } from "../../guards/allow-session";
import { UserSessionDto } from "../../dto/user-session.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { ServerController } from "../../classes/server-controller";
import { REDIS_REPOS } from "../../app.constants";
import { SessionEntity } from "./session.entity";
import { RefreshSessionDto } from "../../dto/refresh-session.dto";
import { config } from "../../../config";
import { UserService } from "../user/user.service";
import { AdminRoleDto } from "../../dto/admin-role.dto";

@Controller("sessions")
export class SessionController extends ServerController {
    constructor(private readonly authService: AuthService,
                private readonly sessionService: SessionService,
                private readonly userService: UserService,
                @Inject(REDIS_REPOS.SESSION) private readonly sessionRepository: typeof SessionEntity) {
        super();
    }

    @Get("google")
    @HttpCode(HttpStatus.PERMANENT_REDIRECT)
    async signup(@Req() req, @Res() res): Promise<void> {
        return await this.authService.signup()
            .then(response => {
                SessionController.success(res, response);
            })
            .catch(error => {
                SessionController.failure(res, error.message);
            });
    }

    @Post("google/callback")
    @HttpCode(HttpStatus.CREATED)
    async signupCallback(@Body("code") code, @Res() res): Promise<void> {
        return await this.authService.processAuthCode(code)
            .then((user: User) => {
                const session = this.sessionService.create(user.id);
                return Promise.all([session, user.toDTO()]);
            })
            .then(([session, user]) => {
                SessionController.success(res, new SessionDataDto(session, user));
            })
            .catch(error => {
                SessionController.failure(res, error);
            });
    }

    @Delete("logout")
    @AllowSessions(UserSessionDto)
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Session() session: UserSessionDto, @Res() res): Promise<void> {
        return await this.sessionService.destroy(session.sessionId)
            .then(() => {
                SessionController.success(res, {});
            })
            .catch(error => {
                SessionController.failure(res, error);
            });
    }

    @Get("is-admin")
    @AllowSessions(UserSessionDto)
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async getIsAdminRole(@Session() session: UserSessionDto, @Res() res): Promise<void> {
        this.userService.getOne(session.userId)
            .then((user) => {
                if (!user) {
                    throw new NotFoundException("User not found");
                }

                const googleId = Number(user.googleId);
                const adminGoogleKeys = config.admin.googleKeys;
                // @ts-ignore
                SessionController.success(res, new AdminRoleDto(adminGoogleKeys.includes(googleId)));
            })
            .catch(error => {
                SessionController.failure(res, error);
            });
        return;
    }

    @Post("refresh")
    @HttpCode(HttpStatus.CREATED)
    async refresh(@Body() refresh: RefreshSessionDto, @Res() res): Promise<void> {
        const session = await this.sessionRepository
            .findOne({
                where: {refreshToken: refresh.refreshToken},
            });

        if (!session) {
            throw new UnprocessableEntityException("Session not found");
        }

        return await this.sessionService.refresh(session)
            .then((data) => {
                SessionController.success(res, data);
            })
            .catch(error => {
                SessionController.failure(res, error);
            });
    }
}