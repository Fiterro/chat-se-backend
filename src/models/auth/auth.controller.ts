import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";

import { ServerController } from "../../classes/server-controller";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController extends ServerController {
    constructor(private readonly authService: AuthService) {
        super();
    }

    @Get("google")
    async signup(@Req() req, @Res() res) {
        return await this.authService.signup()
            .then(response => {
                AuthController.success(res, response);
            })
            .catch(error => {
                AuthController.failure(res, error.message);
            });
    }

    @Post("google/callback")
    async signupCallback(@Body("code") code, @Res() res) {
        return await this.authService.processAuthCode(code)
            .then(response => {
                AuthController.success(res, response);
            })
            .catch(error => {
                AuthController.failure(res, error);
            });
    }
}
