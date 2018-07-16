import { Inject, Injectable } from "@nestjs/common";

import { SEQUELIZE_REPOS } from "../../app.constants";
import { Message } from "./message.entity";

@Injectable()
export class MessagesService {
    constructor(@Inject(SEQUELIZE_REPOS.MESSAGES) private readonly MessageRepository: typeof Message) {
    }

    async findByChatId(chatId: number): Promise<Message[]> {
        return await this.MessageRepository.findAll<Message>({where: {chatId}});
    }
}
