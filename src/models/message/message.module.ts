import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../utils/database/database.module";
import { MessagesProviders } from "./message.providers";
import { MessagesService } from "./message.service";

@Module({
    imports: [DatabaseModule],
    providers: [
        MessagesService,
        ...MessagesProviders,
    ],
    exports: [MessagesService],
})
export class MessageModule {
}
