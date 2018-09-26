import { BelongsTo, Column, CreatedAt, Default, ForeignKey, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";
import { ScopeOptions } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { User } from "../user/user.entity";
import { PaginationDto } from "../../dto/pagination.dto";
import { MessageRead } from "../message-read/message-read.entity";

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
    text: string;

    @ForeignKey(() => User)
    @Column({field: "sender_id"})
    senderId: number;

    @Default(() => Date.now())
    @Column({field: "sent_at"})
    sentAt: Date;

    @Default(() => uuidv4())
    @Column
    uuid: string;

    @BelongsTo(() => User)
    sender: User;

    @HasMany(() => MessageRead)
    views: MessageRead[];

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    static paginationScope(pagination: PaginationDto): ScopeOptions {
        return {method: ["limits", pagination.limit, pagination.offset]};
    }
}
