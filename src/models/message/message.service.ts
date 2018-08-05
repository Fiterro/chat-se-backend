import { Inject, Injectable } from "@nestjs/common";
import { literal, Transaction } from "sequelize";

import { SEQUELIZE_REPOS } from "../../app.constants";
import { ChatMessage } from "../chat-message/chat-message.entity";
import { Message } from "./message.entity";
import { User } from "../user/user.entity";
import { PaginationDto } from "../../dto/pagination.dto";
import { MessageListDto } from "../../dto/message-list.dto";

@Injectable()
export class MessagesService {
    constructor(@Inject(SEQUELIZE_REPOS.MESSAGES) private readonly MessageRepository: typeof Message,
                @Inject(SEQUELIZE_REPOS.CHAT_MESSAGES) private readonly ChatMessagesRepository: typeof ChatMessage) {
    }

    async findByChatId(chatId: number, pagination: PaginationDto): Promise<MessageListDto> {
        // TODO: order output by Message.sentAt
        return await this.ChatMessagesRepository
            .scope(Message.paginationScope(pagination))
            .findAndCountAll<ChatMessage>({
                distinct: true,
                where: {chatId},
                include: [{
                    model: Message,
                    include: [User],
                }],
                order: [literal(`"message"."sent_at" DESC`)],
            })
            .then(({count, rows}) => {
                return new MessageListDto(rows.map((message) => message.toDTO()), count);
            });
    }

    async create(chatId: number, text: string, senderId: number, transaction?: Transaction): Promise<Message> {
        const message = await this.MessageRepository.create({senderId, text}, {transaction});
        await this.ChatMessagesRepository.create({chatId, messageId: message.id}, {transaction});
        return message;
    }
}
