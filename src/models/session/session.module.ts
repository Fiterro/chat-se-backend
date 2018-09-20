import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../utils/database/database.module";
import { SessionProviders } from "./session.providers";
import { SessionService } from "./session.service";
import { SessionServiceProviders } from "./session-service.providers";
import { SessionController } from "./session.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
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