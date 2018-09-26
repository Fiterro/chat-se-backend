import { SEQUELIZE_REPOS } from "../../app.constants";
import { ChatMessage } from "./chat-message.entity";

export const ChatMessagesProviders = [
    {
        provide: SEQUELIZE_REPOS.CHAT_MESSAGES,
        useValue: ChatMessage,
    },
];
