import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../utils/database/database.module";
import { ChatMessagesProviders } from "../chat-message/chat-message.providers";
import { MessagesProviders } from "./message.providers";
import { MessagesService } from "./message.service";

@Module({
    imports: [DatabaseModule],
    providers: [
        MessagesService,
        ...MessagesProviders,
        ...ChatMessagesProviders,
    ],
    exports: [MessagesService],
})
export class MessageModule {
}
