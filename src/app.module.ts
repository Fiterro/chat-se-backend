import { Module, NestModule, RequestMethod } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./models/auth/auth.module";
import { ChatModule } from "./models/chat/chat.module";
import { MessageModule } from "./models/message/message.module";
import { UserModule } from "./models/user/user.module";
import { SocketModule } from "./models/socket/socket.module";
import { MiddlewaresConsumer } from "@nestjs/common/interfaces/middlewares";
import { SessionMiddleware } from "./models/session/session.middleware";
import { SessionModule } from "./models/session/session.module";

@Module({
    imports: [
        UserModule,
        AuthModule,
        ChatModule,
        MessageModule,
        SocketModule,
        SessionModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    // @ts-ignore
    configure(consumer: MiddlewaresConsumer): MiddlewaresConsumer | void {
        return consumer
            .apply(SessionMiddleware)
            .forRoutes({path: "*", method: RequestMethod.ALL} as any);
    }
}
