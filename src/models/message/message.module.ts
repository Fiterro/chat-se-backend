import { forwardRef, Module } from "@nestjs/common";

import { DatabaseModule } from "../../utils/database/database.module";
import { ChatMessagesProviders } from "../chat-message/chat-message.providers";
import { MessagesProviders } from "./message.providers";
import { MessagesService } from "./message.service";
import { MessageReadProviders } from "../message-read/message-read.providers";
import { SocketModule } from "../socket/socket.module";

@Module({
    imports: [DatabaseModule, forwardRef(() => SocketModule)],
    providers: [
        MessagesService,
        ...MessagesProviders,
        ...ChatMessagesProviders,
        ...MessageReadProviders,
    ],
    exports: [MessagesService],
})
export class MessageModule {
}
