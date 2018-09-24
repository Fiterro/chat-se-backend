import { Inject, Injectable } from "@nestjs/common";

import { SEQUELIZE_REPOS } from "../../app.constants";
import { Chat } from "./chat.entity";
import { Op } from "sequelize";

@Injectable()
export class ChatService {
    constructor(@Inject(SEQUELIZE_REPOS.CHATS) private readonly ChatRepository: typeof Chat) {
    }

    async findAll(): Promise<Chat[]> {
        return await this.ChatRepository
            .findAll<Chat>();
    }

    async getOne(id: number): Promise<Chat> {
        return await this.ChatRepository
            .findById<Chat>(id);
    }

    async findByName(name: string): Promise<Chat> {
        return await this.ChatRepository
            .findOne<Chat>({
                where: {
                    name: {
                        [Op.iLike]: name.toLowerCase(),
                    },
                },
            });
    }

    async create(name: string): Promise<Chat> {
        return await this.ChatRepository
            .create<Chat>({name});
    }
}
