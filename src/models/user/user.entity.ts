import { Column, CreatedAt, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";
import { UserDto } from "../../dto/user.dto";
import { MessageRead } from "../message-read/message-read.entity";

@Table({
    tableName: "users",
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})
export class User extends Model<User> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column
    username: string;

    @Column
    email: string;

    @Column({
        field: "first_name",
    })
    firstName: string;

    @Column({
        field: "last_name",
    })
    lastName: string;

    @Column
    avatar: string;

    @Column({
        field: "google_id",
    })
    googleId: string;

    @Column({
        field: "refresh_token",
    })
    refreshToken: string;

    @HasMany(() => MessageRead)
    views: MessageRead[];

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    toDTO(): UserDto {
        return new UserDto(this.id, this.username, this.email, this.firstName, this.lastName, this.avatar, this.googleId);
    }
}
