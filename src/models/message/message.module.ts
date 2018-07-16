import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../utils/database/database.module";
import { MessagesController } from "./message.controller";
import { MessagesProviders } from "./message.providers";
import { MessagesService } from "./message.service";

@Module({
    imports: [DatabaseModule],
    controllers: [MessagesController],
    providers: [
        MessagesService,
        ...MessagesProviders,
    ],
    exports: [MessagesService],
})
export class MessageModule {
}
