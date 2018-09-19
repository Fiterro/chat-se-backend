import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../utils/database/database.module";
import { SessionProviders } from "./session.providers";
import { SessionService } from "./session.service";
import { SessionServiceProviders } from "./session-service.providers";

@Module({
    imports: [DatabaseModule],
    providers: [
        ...SessionProviders,
        SessionService,
        SessionServiceProviders,
    ],
    exports: [
        SessionService,
        SessionServiceProviders,
    ],
})
export class SessionModule {

}