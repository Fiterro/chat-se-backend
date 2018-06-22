import { Sequelize } from "sequelize-typescript";

import { config } from "../../../config";
import { SEQUELIZE_TOKEN } from "../../app.constants";
import { Chat } from "../../models/chat/chat.entity";
import { User } from "../../models/user/user.entity";

export const DatabaseProviders = [
    {
        provide: SEQUELIZE_TOKEN,
        useFactory: async () => {
            const sequelize = new Sequelize({
                host: config.db.host,
                port: config.db.port,
                username: config.db.user,
                password: config.db.password,
                database: config.db.database,
                dialect: config.db.dialect,
                operatorsAliases: false,
            });
            sequelize.addModels([User, Chat]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
