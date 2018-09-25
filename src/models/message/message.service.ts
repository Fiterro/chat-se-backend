import { Inject, Injectable } from "@nestjs/common";
import { literal, Op, Transaction } from "sequelize";

import { SEQUELIZE_REPOS } from "../../app.constants";
import { ChatMessage } from "../chat-message/chat-message.entity";
import { Message } from "./message.entity";
import { User } from "../user/user.entity";
import { PaginationDto } from "../../dto/pagination.dto";
import { MessageListDto } from "../../dto/message-list.dto";
import { ActivityItemDto } from "../../dto/activity-item.dto";
import { ParticipantShort } from "../../types/participant-short.type";
import { MessageDto } from "../../dto/message.dto";
import { MessageRead } from "../message-read/message-read.entity";

interface MessagesAndCount {
    rows: ChatMessage[];
    count: number;
}

@Injectable()
export class MessagesService {
    constructor(@Inject(SEQUELIZE_REPOS.MESSAGES) private readonly MessageRepository: typeof Message,
                @Inject(SEQUELIZE_REPOS.MESSAGE_READ) private readonly MessageReadRepository: typeof MessageRead,
                @Inject(SEQUELIZE_REPOS.CHAT_MESSAGES) private readonly ChatMessagesRepository: typeof ChatMessage) {
    }

    async findByChatId(chatId: number, pagination: PaginationDto, userId?: number): Promise<MessageListDto> {
        const messagesList: MessagesAndCount = await this.getMessagesList(chatId, pagination);
        const messageIds: number[] = messagesList.rows.map(message => message.id);
        const numberOfViews: MessageRead[] = await this.countViews(messageIds);
        const messageIdsNew = userId ? await this.getNewMessages(messageIds, userId) : undefined;
        const messagesDto = messagesList.rows.map((message) => {
            const index = numberOfViews.findIndex((value) => value.messageId === message.id);
            const isNew = messageIdsNew.findIndex((value) => value === message.messageId) >= 0;
            return index >= 0
                ? message.toDTO(Number(numberOfViews[index].dataValues.countViews), isNew)
                : message.toDTO(0, isNew);
        });

        return new MessageListDto(messagesDto, messagesList.count);
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

    async create(chatId: number, text: string, senderId: number, uuid: string, transaction?: Transaction): Promise<ChatMessage> {
        const message = await this.MessageRepository.create({senderId, text, uuid}, {transaction});
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

    async readMessages(messageIds: number[], userId: number): Promise<MessageRead[]> {
        return await this.findReadMessages(messageIds, userId)
            .then((readMessages) => {
                const readIds: number[] = readMessages.map((message) => message.messageId);
                const dataToCreate = messageIds
                    .reduce((acc, val) => {
                        // @ts-ignore
                        if (!readIds.includes(val)) {
                            acc.push({messageId: val, userId});
                        }
                        return acc;
                    }, []);

                return this.MessageReadRepository
                    .bulkCreate<MessageRead>(dataToCreate)
                    .then((result) => {
                        return result;
                    });
            });
    }

    async findReadMessages(messageIds: number[], userId: number): Promise<MessageRead[]> {
        return await this.MessageReadRepository
            .findAll<MessageRead>({
                distinct: true,
                where: {
                    userId,
                    messageId: {
                        [Op.in]: messageIds,
                    },
                },
            });
    }

    private async countViews(messagesIds: number[]): Promise<MessageRead[]> {
        const seq = this.MessageReadRepository.sequelize;
        return this.MessageReadRepository
            .findAll({
                where: {
                    messageId: {
                        [Op.in]: messagesIds,
                    },
                },
                attributes: ["messageId", [seq.fn("COUNT", seq.col("user_id")), "countViews"]],
                order: ["messageId"],
                group: ["messageId"],
            });
    }

    private async getNewMessages(messagesIds: number[], userId: number): Promise<number[]> {
        const seq = this.MessageReadRepository.sequelize;
        return this.MessageReadRepository
            .findAll({
                where: {
                    userId,
                    messageId: {
                        [Op.in]: messagesIds,
                    },
                },
                attributes: ["messageId", [seq.fn("COUNT", seq.col("user_id")), "countViews"]],
                order: ["messageId"],
                group: ["messageId"],
            })
            .then((result) => {
                return messagesIds.reduce((acc, id) => {
                    // @ts-ignore
                    if (!result.map((res) => res.messageId).includes(id)) {
                        acc.push(id);
                    }
                    return acc;
                }, []);
            });
    }

    private async getMessagesList(chatId: number, pagination: PaginationDto): Promise<MessagesAndCount> {
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
            });
    }

    private obtainParticipant(chatMessages: ChatMessage[]): ParticipantShort[] {
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
