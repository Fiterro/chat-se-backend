import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";

import { Chat } from "../chat/chat.entity";
import { Message } from "../message/message.entity";

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

    @BelongsTo(() => Chat)
    chat: Chat;

    @BelongsTo(() => Message)
    message: Message;
}
