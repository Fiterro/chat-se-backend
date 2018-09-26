import { Module } from "@nestjs/common";

import { DatabaseProviders } from "./database.providers";
import { redisProvider } from "../../providers/redis.provider";

@Module({
    providers: [...DatabaseProviders, redisProvider],
    exports: [...DatabaseProviders, redisProvider],
})
export class DatabaseModule {
}
