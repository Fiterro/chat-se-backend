import { forwardRef, Module } from "@nestjs/common";

import { DatabaseModule } from "../../utils/database/database.module";
import { EventsGateway } from "./events.gateway";
import { MessageModule } from "../message/message.module";

@Module({
    imports: [
        DatabaseModule,
        forwardRef(() => MessageModule),
    ],
    providers: [
        EventsGateway,
    ],
    exports: [
        EventsGateway,
    ],
})
export class SocketModule {
}
