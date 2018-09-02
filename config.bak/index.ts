export const config = {
    server: {
        protocol: "http",
        host: "localhost",
        port: 8001,
    },
    db: {
        host: "172.18.0.2",
        database: "se_db",
        port: 5432,
        user: "postgres",
        password: "postgres",
        dialect: "postgres",
    },
    redis: {
        prefix: "se_dev",
        host: "127.0.0.1",
        port: 6379,
    },
    googleAuth: {
        GOOGLE_CONSUMER_KEY: "386387919756-hl25j9g3h7f2ehmo1khh0vu23u8dsf1c.apps.googleusercontent.com",
        GOOGLE_CONSUMER_SECRET: "YntjPkqO32fmu0uHnbPmGPcs",
        GOOGLE_CALLBACK_URL: "http://localhost:4200/oauth",
    },
    jwtKey: "some-kind-of-js-secret-key",
    jwtLifeTime: 24 * 60 * 60, // 1 day
};
