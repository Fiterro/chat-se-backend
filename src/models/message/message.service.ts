import { Inject, Injectable } from "@nestjs/common";
import { Transaction } from "sequelize";

import { SEQUELIZE_REPOS } from "../../app.constants";
import { ChatMessage } from "../chat-message/chat-message.entity";
import { Message } from "./message.entity";

@Injectable()
export class MessagesService {
    constructor(@Inject(SEQUELIZE_REPOS.MESSAGES) private readonly MessageRepository: typeof Message,
                @Inject("ChatMessagesRepository") private readonly ChatMessagesRepository: typeof ChatMessage) {
    }

    async findByChatId(chatId: number): Promise<Message[]> {
        // TODO: pg db rework of message storing
        return await this.MessageRepository
            .findAll<Message>({
                distinct: true,
            });
    }

    async create(chatId: number, text: string, senderId: number, transaction?: Transaction): Promise<Message> {
        const message = await this.MessageRepository.create({senderId, text}, {transaction});
        await this.ChatMessagesRepository.create({chatId, messageId: message.id}, {transaction});
        return message;
    }
}
