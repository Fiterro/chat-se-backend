import { Column, CreatedAt, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";

import { ChatMessage } from "../chat-message/chat-message.entity";

@Table({
    tableName: "chats",
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})
export class Chat extends Model<Chat> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column
    name: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @HasMany(() => ChatMessage)
    chatMessages: ChatMessage[];
}
