import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../utils/database/database.module";
import { MessageModule } from "../message/message.module";
import { ChatController } from "./chat.controller";
import { ChatProviders } from "./chat.providers";
import { ChatService } from "./chat.service";
import {SocketModule} from "../socket/socket.module";

@Module({
    imports: [
        DatabaseModule,
        MessageModule,
        SocketModule,
    ],
    controllers: [ChatController],
    providers: [
        ChatService,
        ...ChatProviders,
    ],
    exports: [ChatService],
})
export class ChatModule {
}
