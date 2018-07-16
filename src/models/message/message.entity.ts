import { Column, CreatedAt, Model, Table, UpdatedAt } from "sequelize-typescript";

@Table({
    tableName: "messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})
export class Message extends Model<Message> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column
    chatId: number;

    @Column
    senderId: number;

    @Column
    text: string;

    @Column
    status: number;

    @Column
    viewCount: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
