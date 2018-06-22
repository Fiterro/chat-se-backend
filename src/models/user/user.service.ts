import { Inject, Injectable } from "@nestjs/common";

import { SEQUELIZE_REPOS } from "../../app.constants";
import { User } from "./user.entity";

@Injectable()
export class UserService {
    constructor(@Inject(SEQUELIZE_REPOS.USERS) private readonly UsersRepository: typeof User) {
    }

    async findAll(): Promise<User[]> {
        return await this.UsersRepository.findAll<User>();
    }

    async getOne(id: number): Promise<User> {
        return await this.UsersRepository.findById<User>(id);
    }

    async addOne(data): Promise<User> {
        return await this.UsersRepository.create<User>(data);
    }

    async findOrCreate(user: User): Promise<User> {
        return await this.UsersRepository
            .findOrCreate<User>({where: {googleId: user.googleId}, defaults: user})
            .then((data: [User, boolean]) => data[0]);
    }

    format(user) {
        return {
            id: user.id,
            email: user.email,
            profile: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                googleId: user.googleId,
            },
            token: user.token,
        };
    }
}
