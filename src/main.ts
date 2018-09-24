import { HTTP_SERVER_REF, NestFactory } from "@nestjs/core";
import * as cors from "cors";

import { AppModule } from "./app.module";
import { RedisIoAdapter } from "./adapters/redis-adapter";
import { AllExceptionsFilter } from "./classes/all-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {cors: true});
    const httpRef = app.get(HTTP_SERVER_REF);
    app.use(cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }));
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.useGlobalFilters(new AllExceptionsFilter(httpRef));
    await app.listen(3000);
}

bootstrap();
