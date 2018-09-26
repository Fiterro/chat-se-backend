import { SEQUELIZE_REPOS } from "../../app.constants";
import { MessageRead } from "./message-read.entity";

export const MessageReadProviders = [
    {
        provide: SEQUELIZE_REPOS.MESSAGE_READ,
        useValue: MessageRead,
    },
];
