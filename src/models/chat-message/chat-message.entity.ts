import { BelongsTo, Column, CreatedAt, ForeignKey, Model, Scopes, Table, UpdatedAt } from "sequelize-typescript";

import {Chat} from "../chat/chat.entity";
import {Message} from "../message/message.entity";
import { MessageDto } from "../../dto/message.dto";

@Scopes({
    limits(limit: number, offset: number) {
        return {limit, offset};
    },
})
@Table({
    tableName: "chats_messages",
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})
export class ChatMessage extends Model<ChatMessage> {
    @ForeignKey(() => Message)
    @Column({field: "message_id"})
    messageId: number;

    @ForeignKey(() => Chat)
    @Column({field: "chat_id"})
    chatId: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @BelongsTo(() => Chat)
    chat: Chat;

    @BelongsTo(() => Message)
    message: Message;

    viewCount = 0;
    toDTO(): MessageDto {
        return new MessageDto(
            this.message.id,
            this.chatId,
            this.message.text,
            this.message.uuid,
            this.message.sentAt,
            this.message.sender,
            this.viewCount,
            this.createdAt,
            this.updatedAt,
        );
    }
}
