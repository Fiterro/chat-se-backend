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
    admin: {
        googleKeys: ["GOOGLE_IDS_OF_ADMIN_USERS"],
    },
    googleAuth: {
        GOOGLE_CONSUMER_KEY: "GOOGLE_CONSUMER_KEY",
        GOOGLE_CONSUMER_SECRET: "GOOGLE_CONSUMER_SECRET",
        GOOGLE_CALLBACK_URL: "http://GOOGLE_CALLBACK_URL",
    },
    jwtKey: "some-kind-of-js-secret-key",
    jwtLifeTime: 24 * 60 * 60, // 1 day
};
