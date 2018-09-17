import { User } from "../models/user/user.entity";

export class MessageDto {
    readonly id: number;
    readonly chatId: number;
    readonly text: string;
    readonly uuid: string;
    readonly sentAt: Date;
    readonly sender: User;
    readonly isRead: boolean;
    readonly viewCount: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(id: number,
                chatId: number,
                text: string,
                uuid: string,
                sentAt: Date,
                sender: User,
                isRead: boolean,
                viewCount: number,
                createdAt: Date,
                updatedAt: Date) {
        this.id = id;
        this.chatId = chatId;
        this.text = text;
        this.uuid = uuid;
        this.sentAt = sentAt;
        this.sender = sender;
        this.isRead = isRead;
        this.viewCount = viewCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
