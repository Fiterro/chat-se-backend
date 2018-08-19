import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../utils/database/database.module";
import { ChatModule } from "../chat/chat.module";
import { EventsGateway } from "./events.gateway";

@Module({
    imports: [
        DatabaseModule,
        ChatModule,
    ],
    components: [
        EventsGateway,
    ],
})
export class SocketModule {
}
