import { SEQUELIZE_REPOS } from "../../app.constants";
import { Message } from "./message.entity";

export const MessagesProviders = [
    {
        provide: SEQUELIZE_REPOS.MESSAGES,
        useValue: Message,
    },
];
