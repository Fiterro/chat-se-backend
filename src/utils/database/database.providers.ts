import { Sequelize } from "sequelize-typescript";

import { config } from "../../../config";
import { SEQUELIZE_TOKEN } from "../../app.constants";
import { User } from "../../models/user/user.entity";
import { Chat } from "../../models/chat/chat.entity";
import { Message } from "../../models/message/message.entity";

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
            sequelize.addModels([User, Chat, Message]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
