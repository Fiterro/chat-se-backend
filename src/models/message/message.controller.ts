import { Controller, Get, HttpStatus, Param, Res } from "@nestjs/common";

import { ServerController } from "../../classes/server-controller";
import { MessagesService } from "./message.service";

@Controller("messages")
export class MessagesController extends ServerController {
    constructor(private readonly messagesService: MessagesService) {
        super();
    }

    @Get(":id")
    async findByChatId(@Res() res, @Param("id") id) {
        return this.messagesService.findByChatId(id)
            .then((result) => {
                if (!result) {
                    res.status(HttpStatus.NOT_FOUND);
                    return MessagesController.failure(res, new Error("Something went wrong"));
                }
                res.status(HttpStatus.OK);
                MessagesController.success(res, result);
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                return MessagesController.failure(res, error);
            });
    }
}
