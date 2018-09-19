import { Module } from "@nestjs/common";

import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SessionModule } from "../session/session.module";

@Module({
    imports: [
        UserModule,
        SessionModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {
}
