import { Column, CreatedAt, Model, Table, UpdatedAt } from "sequelize-typescript";

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

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    token?: string;
}
