import { Inject, Injectable } from "@nestjs/common";
import { literal, Transaction } from "sequelize";

import { SEQUELIZE_REPOS } from "../../app.constants";
import { ChatMessage } from "../chat-message/chat-message.entity";
import { Message } from "./message.entity";
import { User } from "../user/user.entity";
import { PaginationDto } from "../../dto/pagination.dto";
import { MessageListDto } from "../../dto/message-list.dto";
import { ActivityItemDto } from "../../dto/activity-item.dto";
import { ParticipantShort } from "../../types/participant-short.type";
import { MessageDto } from "../../dto/message.dto";

@Injectable()
export class MessagesService {
    constructor(@Inject(SEQUELIZE_REPOS.MESSAGES) private readonly MessageRepository: typeof Message,
                @Inject(SEQUELIZE_REPOS.CHAT_MESSAGES) private readonly ChatMessagesRepository: typeof ChatMessage) {
    }

    async findByChatId(chatId: number, pagination: PaginationDto): Promise<MessageListDto> {
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

    async findOne(messageId: number): Promise<MessageDto> {
        return await this.ChatMessagesRepository
            .findById(messageId, {
                include: [{
                    model: Message,
                    include: [User],
                }],
            })
            .then((message: ChatMessage) => {
                return message.toDTO();
            });
    }

    async create(chatId: number, text: string, senderId: number, transaction?: Transaction): Promise<ChatMessage> {
        const message = await this.MessageRepository.create({senderId, text}, {transaction});
        return await this.ChatMessagesRepository.create({chatId, messageId: message.id}, {transaction});
    }

    async findActivities(chatId: number): Promise<ActivityItemDto[]> {
        return await this.ChatMessagesRepository
            .findAll<ChatMessage>({
                where: {chatId},
                include: [{
                    model: Message,
                    include: [User],
                }],
                order: [literal(`"message"."sent_at" DESC`)],
            })
            .then((messages: ChatMessage[]) => {
                // group messages by date
                const groupsData = messages.reduce((groups, message) => {
                    const date = message.message.sentAt.toISOString().split("T")[0];
                    if (!groups[date]) {
                        groups[date] = [];
                    }
                    groups[date].push(message);
                    return groups;
                }, {} as any);
                const groupArrays = Object.keys(groupsData).map((date) => {
                    return {
                        timestamp: date,
                        participants: this.obtainParticipant(groupsData[date]),
                    };
                });
                return groupArrays.length ? groupArrays.map((group) => new ActivityItemDto(group)) : [];
            });
    }

    obtainParticipant(chatMessages: ChatMessage[]): ParticipantShort[] {
        const participants: ParticipantShort[] = [];
        const map = new Map();
        chatMessages.forEach((item) => {
            const key = item.toDTO().sender.avatar;
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        map.forEach((value, key) => {
            participants.push({
                avatar: key,
                messageCount: value.length,
            });
        });
        return participants;
    }
}
