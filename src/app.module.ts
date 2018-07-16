import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./models/auth/auth.module";
import { ChatModule } from "./models/chat/chat.module";
import { MessageModule } from "./models/message/message.module";
import { UserModule } from "./models/user/user.module";

@Module({
    imports: [
        UserModule,
        AuthModule,
        ChatModule,
        MessageModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
