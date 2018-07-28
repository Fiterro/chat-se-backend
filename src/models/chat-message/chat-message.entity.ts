import { BelongsTo, Column, CreatedAt, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";

import {Chat} from "../chat/chat.entity";
import {Message} from "../message/message.entity";
import { MessageDto } from "../../dto/message.dto";

@Table({
    tableName: "chats_messages",
    timestamps: true,
    underscored: true,
    underscoredAll: true,
})
export class ChatMessage extends Model<ChatMessage> {
    @ForeignKey(() => Message)
    @Column({field: "message_id"})
    messageId: number;

    @ForeignKey(() => Chat)
    @Column({field: "chat_id"})
    chatId: number;

    @Column({field: "is_read"})
    isRead: boolean;

    @Column({field: "view_count"})
    viewCount: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @BelongsTo(() => Chat)
    chat: Chat;

    @BelongsTo(() => Message)
    message: Message;

    toDTO(): MessageDto {
        return new MessageDto(
            this.message.id,
            this.message.text,
            this.message.sentAt,
            this.message.sender,
            this.isRead,
            this.viewCount,
            this.createdAt,
            this.updatedAt,
        );
    }
}
