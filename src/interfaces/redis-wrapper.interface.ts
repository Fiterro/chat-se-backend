export interface IRedisWrapper {
    get(key: string): Promise<string>;
    set(key: string, value: string, expireTime: number): Promise<void>;
    del(...keys: string[]): Promise<void>;

    /**
     * returns number of added values
     *
     * @param {string} key
     * @param {string} values
     * @returns {Promise<number>}
     */
    sadd(key: string, ...values: string[]): Promise<number>;
    smembers(key: string): Promise<string[]>;
    expire(key: string, time: number): Promise<void>;
}
