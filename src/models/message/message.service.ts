import { Inject, Injectable } from "@nestjs/common";
import { Transaction } from "sequelize";

import { SEQUELIZE_REPOS } from "../../app.constants";
import { ChatMessage } from "../chat-message/chat-message.entity";
import { Message } from "./message.entity";
import {User} from "../user/user.entity";
import { MessageDto } from "../../dto/message.dto";

@Injectable()
export class MessagesService {
    constructor(@Inject(SEQUELIZE_REPOS.MESSAGES) private readonly MessageRepository: typeof Message,
                @Inject(SEQUELIZE_REPOS.CHAT_MESSAGES) private readonly ChatMessagesRepository: typeof ChatMessage) {
    }

    async findByChatId(chatId: number): Promise<MessageDto[]> {
        // TODO: pg db rework of message storing
        return await this.ChatMessagesRepository
            .findAll<ChatMessage>({
                distinct: true,
                where: {chatId},
                include: [{
                    model: Message,
                    include: [User],
                }],
            })
            .then((chatMessages) => chatMessages.map((message) => message.toDTO()));
    }

    async create(chatId: number, text: string, senderId: number, transaction?: Transaction): Promise<Message> {
        const message = await this.MessageRepository.create({senderId, text}, {transaction});
        await this.ChatMessagesRepository.create({chatId, messageId: message.id}, {transaction});
        return message;
    }
}
