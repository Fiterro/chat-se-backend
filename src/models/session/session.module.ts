import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../utils/database/database.module";
import { SessionProviders } from "./session.providers";
import { SessionService } from "./session.service";
import { SessionServiceProviders } from "./session-service.providers";
import { SessionController } from "./session.controller";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        UserModule,
    ],
    providers: [
        ...SessionProviders,
        SessionService,
        SessionServiceProviders,
    ],
    controllers: [SessionController],
    exports: [
        SessionService,
        SessionServiceProviders,
    ],
})
export class SessionModule {

}