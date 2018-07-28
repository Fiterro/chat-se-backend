import { User } from "../models/user/user.entity";

export class MessageDto {
    readonly id: number;
    readonly text: string;
    readonly sentAt: Date;
    readonly sender: User;
    readonly isRead: boolean;
    readonly viewCount: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(id: number, text: string, sentAt: Date, sender: User, isRead: boolean, viewCount: number, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.text = text;
        this.sentAt = sentAt;
        this.sender = sender;
        this.isRead = isRead;
        this.viewCount = viewCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
