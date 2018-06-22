import { SEQUELIZE_REPOS } from "../../app.constants";
import { Chat } from "./chat.entity";

export const ChatProviders = [
    {
        provide: SEQUELIZE_REPOS.CHATS,
        useValue: Chat,
    },
];
