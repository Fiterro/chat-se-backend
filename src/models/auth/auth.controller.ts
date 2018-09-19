import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Req, Res, Session, UseGuards } from "@nestjs/common";

import { ServerController } from "../../classes/server-controller";
import { AuthService } from "./auth.service";
import { SessionService } from "../session/session.service";
import { User } from "../user/user.entity";
import { SessionDataDto } from "../../dto/session-data.dto";
import { AllowSessions } from "../../guards/allow-session";
import { AuthGuard } from "../../guards/auth.guard";
import { UserSessionDto } from "../../dto/user-session.dto";

@Controller("auth")
export class AuthController extends ServerController {
    constructor(private readonly authService: AuthService,
                private readonly sessionService: SessionService) {
        super();
    }

    @Get("google")
    @HttpCode(HttpStatus.PERMANENT_REDIRECT)
    async signup(@Req() req, @Res() res): Promise<void> {
        return await this.authService.signup()
            .then(response => {
                AuthController.success(res, response);
            })
            .catch(error => {
                AuthController.failure(res, error.message);
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
                AuthController.success(res, new SessionDataDto(session, user));
            })
            .catch(error => {
                AuthController.failure(res, error);
            });
    }

    @Delete("logout")
    @AllowSessions(UserSessionDto)
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Session() session: UserSessionDto, @Res() res): Promise<void> {
        return await this.sessionService.destroy(session.sessionId)
            .then(() => {
                AuthController.success(res, {});
            })
            .catch(error => {
                AuthController.failure(res, error);
            });
    }
}
