import {IoAdapter} from "@nestjs/websockets";
import * as redisIoAdapter from "socket.io-redis";
import {SocketIORedisOptions} from "socket.io-redis";

import {config} from "../../config";

const redisAdapter = redisIoAdapter({
    host: config.redis.host,
    port: config.redis.port,
} as SocketIORedisOptions);

export class RedisIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        return server;
    }
}