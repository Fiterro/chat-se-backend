import { Body, Controller, Get, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Res } from "@nestjs/common";

import { ServerController } from "../../classes/server-controller";
import { Message } from "../message/message.entity";
import { MessagesService } from "../message/message.service";
import { Chat } from "./chat.entity";
import { ChatService } from "./chat.service";

@Controller("chats")
export class ChatController extends ServerController {
    constructor(private readonly chatService: ChatService,
                private readonly messagesService: MessagesService) {
        super();
    }

    @Get()
    async findAll(@Res() res) {
        return this.chatService.findAll()
            .then((result) => {
                res.status(HttpStatus.OK);
                ChatController.success(res, result);
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                return ChatController.failure(res, error);
            });
    }

    @Get(":id")
    async findOne(@Res() res, @Param("id") id) {
        return this.chatService.getOne(id)
            .then((result) => {
                if (!result) {
                    throw new NotFoundException("Chat not found");
                }
                res.status(HttpStatus.OK);
                ChatController.success(res, result);
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                return ChatController.failure(res, error);
            });
    }

    @Get(":id/messages")
    async getMessagesByChatId(@Res() res, @Param("id") id) {
        return this.chatService.getOne(id)
            .then((result: Chat) => {
                if (!result) {
                    throw new NotFoundException("Chat not found");
                }
                return this.messagesService.findByChatId(result.id);
            })
            .then((result: Message[]) => {
                res.status(HttpStatus.OK);
                ChatController.success(res, result);
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                return ChatController.failure(res, error);
            });
    }

    @Post("messages")
    async sendMessage(@Res() res, @Body() body) {
        return this.messagesService.create(body.chatId, body.text)
            .then((result) => {
                if (!result) {
                    throw new InternalServerErrorException("Message not created");
                }
                res.status(HttpStatus.OK);
                ChatController.success(res, result);
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                return ChatController.failure(res, error);
            });
    }
}
