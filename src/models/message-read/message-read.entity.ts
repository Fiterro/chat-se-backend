import { Column, CreatedAt, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { Message } from "../message/message.entity";
import { User } from "../user/user.entity";
import { MessageReadDto } from "../../dto/message-read.dto";

@Table({
    tableName: "message_read",
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})
export class MessageRead extends Model<MessageRead> {
    @ForeignKey(() => Message)
    @Column({field: "message_id"})
    messageId: number;

    @ForeignKey(() => User)
    @Column({field: "user_id"})
    userId: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    // This field is for counter of messages read
    countViews?: number;

    toDTO(countViews = 0): MessageReadDto {
        return new MessageReadDto(this.messageId, this.userId, countViews);
    }
}