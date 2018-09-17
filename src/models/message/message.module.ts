import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../utils/database/database.module";
import { ChatMessagesProviders } from "../chat-message/chat-message.providers";
import { MessagesProviders } from "./message.providers";
import { MessagesService } from "./message.service";
import { SocketModule } from "@nestjs/websockets/socket-module";
import { MessageReadProviders } from "../message-read/message-read.providers";

@Module({
    imports: [DatabaseModule],
    providers: [
        MessagesService,
        ...MessagesProviders,
        ...ChatMessagesProviders,
        ...MessageReadProviders,
        SocketModule,
    ],
    exports: [MessagesService],
})
export class MessageModule {
}
