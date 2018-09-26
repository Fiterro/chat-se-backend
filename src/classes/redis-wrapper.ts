import { RedisClient } from "redis";

import { IRedisWrapper } from "../interfaces/redis-wrapper.interface";

export class RedisWrapper implements IRedisWrapper {
    constructor(private readonly redisClient: RedisClient) {
    }

    expire(key: string, seconds: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.redisClient.expire(key, seconds, (error) => {
                return error ? reject(error) : resolve();
            });
        });
    }

    get(key: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.redisClient.get(key, (error, value) => {
                return error ? reject(error) : resolve(value);
            });
        });
    }

    set(key: string, value: string, expireTime: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.redisClient.setex(key, expireTime, value, (error: Error | null) => {
                return error ? reject(error) : resolve();
            });
        });
    }

    del(...keys: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            this.redisClient.del(keys, (error: Error | null) => {
                return error ? reject(error) : resolve();
            });
        });
    }

    /**
     * returns number of added values
     *
     * @param {string} key
     * @param {string} values
     * @returns {Promise<number>}
     */
    sadd(key: string, ...values: string[]): Promise<number> {
        return new Promise((resolve, reject) => {
            this.redisClient.sadd(key, values, (error: Error | null, added: number) => {
                return error ? reject(error) : resolve(added);
            });
        });
    }

    smembers(key: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.redisClient.smembers(key, (error: Error | null, values: string[]) => {
                return error ? reject(error) : resolve(values);
            });
        });
    }
}
