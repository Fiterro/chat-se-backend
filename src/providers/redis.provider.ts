import { ClientOpts, createClient, RetryStrategy, RetryStrategyOptions } from "redis";

import { config } from "../../config";
import { Logger } from "@nestjs/common";
import { REDIS_TOKEN } from "../app.constants";

// one hour
const MAX_TOTAL_RETRY_TIME = 3600000;
const MAX_ATTEMPTS = 10;
// one second
const RETRY_DELAY = 1000;

const ON_RECONNECTING = "reconnecting";
const ON_ERROR = "error";
const ON_CONNECT = "connect";

const retryStrategy: RetryStrategy = (options: RetryStrategyOptions): number | Error => {
    if (options.total_retry_time > MAX_TOTAL_RETRY_TIME) {
        // End reconnecting after a specific timeout
        // and flush all commands with a individual error
        return new Error("Retry time exhausted");
    }

    if (options.times_connected > MAX_ATTEMPTS) {
        // End reconnecting with built in error
        return options.error;
    }

    // reconnect after
    return RETRY_DELAY * options.times_connected;
};

export const redisProvider = {
    provide: REDIS_TOKEN,
    useFactory() {
        const redisConfig = config.redis;
        const _config: ClientOpts = Object.assign({
            retry_strategy: retryStrategy,
        }, redisConfig);
        const client = createClient(_config);

        client.on(ON_RECONNECTING, (param) => {
            Logger.warn("Redis connection has not been established. Reconnecting... Attempt: %s ", param.attempt);

            if (param.attempt >= MAX_ATTEMPTS) {
                Logger.error("Web server is going to shut down. Disconnecting...");
                process.exit(1);
            }
        });
        client.on(ON_ERROR, (error) => {
            Logger.error(error);
        });
        client.on(ON_CONNECT, () => {
            Logger.warn("Redis successfully connected");
        });
        return client;
    },
};
