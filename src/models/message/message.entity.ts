import {BelongsTo, Column, CreatedAt, Default, DefaultScope, ForeignKey, Model, Table, UpdatedAt} from "sequelize-typescript";

import {User} from "../user/user.entity";
import { PaginationDto } from "../../dto/pagination.dto";
import { ScopeOptions } from "sequelize";

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

    @BelongsTo(() => User)
    sender: User;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    static paginationScope(pagination: PaginationDto): ScopeOptions {
        return { method: ["limits", pagination.limit, pagination.offset] };
    }
}
