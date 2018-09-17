import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../utils/database/database.module";
import { MessageModule } from "../message/message.module";
import { ChatController } from "./chat.controller";
import { ChatProviders } from "./chat.providers";
import { ChatService } from "./chat.service";

@Module({
    imports: [
        DatabaseModule,
        MessageModule,
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
