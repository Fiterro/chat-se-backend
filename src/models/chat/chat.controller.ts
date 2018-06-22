import { Controller, Get, HttpStatus, Param, Res } from "@nestjs/common";

import { ServerController } from "../../classes/server-controller";
import { ChatService } from "./chat.service";

@Controller("chats")
export class ChatController extends ServerController {
    constructor(private readonly chatService: ChatService) {
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
                    res.status(HttpStatus.NOT_FOUND);
                    return ChatController.failure(res, new Error("Chat not found"));
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
