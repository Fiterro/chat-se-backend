import { NestFactory } from "@nestjs/core";
import * as cors from "cors";

import { AppModule } from "./app.module";
import { RedisIoAdapter } from "./adapters/redis-adapter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.use(cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }));
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    await app.listen(3000);
}

bootstrap();
