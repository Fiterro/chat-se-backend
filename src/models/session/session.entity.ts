import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";

import { User } from "../user/user.entity";

@Table({
    tableName: "session",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})
export class SessionEntity extends Model<SessionEntity> {
    @ForeignKey(() => User)
    @Column({field: "user_id"})
    userId: number;

    @Column({field: "refresh_token"})
    refreshToken: string;

    @BelongsTo(() => User)
    user: User;
}
