import { Column, CreatedAt, Model, Table, UpdatedAt } from "sequelize-typescript";

@Table({
    tableName: "chats",
    timestamps: true,
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
}
