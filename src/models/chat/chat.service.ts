import { Inject, Injectable } from "@nestjs/common";

import { SEQUELIZE_REPOS } from "../../app.constants";
import { Chat } from "./chat.entity";

@Injectable()
export class ChatService {
    constructor(@Inject(SEQUELIZE_REPOS.CHATS) private readonly ChatRepository: typeof Chat) {
    }

    async findAll(): Promise<Chat[]> {
        return await this.ChatRepository.findAll<Chat>();
    }

    async getOne(id: number): Promise<Chat> {
        return await this.ChatRepository.findById<Chat>(id);
    }
}
