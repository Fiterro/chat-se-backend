import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Query,
    Res,
    UseGuards,
    UsePipes,
} from "@nestjs/common";

import { ServerController } from "../../classes/server-controller";
import { MessagesService } from "../message/message.service";
import { Chat } from "./chat.entity";
import { ChatService } from "./chat.service";
import { Pagination } from "../../types/pagination.type";
import { PaginationDto } from "../../dto/pagination.dto";
import { MessageListDto } from "../../dto/message-list.dto";
import { ChatMessageSchema } from "../../schemas/chat-message.schema";
import { ChatMessageDto } from "../../dto/chat-message.dto";
import { JoiValidationPipe } from "../../pipes/joi-validation.pipe";
import { ChatSchema } from "../../schemas/chat.schema";
import { ActivityItemDto } from "../../dto/activity-item.dto";
import { MessageRead } from "../message-read/message-read.entity";
import { AllowSessions } from "../../guards/allow-session";
import { UserSessionDto } from "../../dto/user-session.dto";
import { AuthGuard } from "../../guards/auth.guard";

@Controller("chats")
@AllowSessions(UserSessionDto)
@UseGuards(AuthGuard)
export class ChatController extends ServerController {
    constructor(private readonly chatService: ChatService,
                private readonly messagesService: MessagesService) {
        super();
    }

    @Get()
    async findAll(@Res() res): Promise<void> {
        return this.chatService.findAll()
            .then((result) => {
                res.status(HttpStatus.OK);
                ChatController.success(res, result);
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                ChatController.failure(res, error);
            });
    }

    @Post()
    @UsePipes(new JoiValidationPipe(ChatSchema))
    @HttpCode(HttpStatus.CREATED)
    async createChat(@Body() body, @Res() res): Promise<void> {
        return this.chatService.create(body.name)
            .then((result) => {
                ChatController.success(res, result);
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                ChatController.failure(res, error);
            });
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async findOne(@Res() res, @Param("id") id): Promise<void> {
        return this.chatService.getOne(id)
            .then((result) => {
                if (!result) {
                    throw new NotFoundException("Chat not found");
                }
                ChatController.success(res, result);
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                ChatController.failure(res, error);
            });
    }

    @Get(":id/messages")
    @HttpCode(HttpStatus.OK)
    async getMessagesByChatId(@Res() res, @Param("id") id, @Query() query: Pagination): Promise<void> {
        return this.chatService.getOne(id)
            .then((result: Chat) => {
                if (!result) {
                    throw new NotFoundException("Chat not found");
                }
                return this.messagesService.findByChatId(result.id, new PaginationDto(query));
            })
            .then((result: MessageListDto) => {
                // TODO: get data by messageId in message_read: group by messageId and count
                ChatController.success(res, result.data, result.pagination);
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                ChatController.failure(res, error);
            });
    }

    @Get(":id/activity")
    @HttpCode(HttpStatus.OK)
    async getActivityByChatId(@Res() res, @Param("id") id, @Query() query: Pagination): Promise<void> {
        return this.chatService.getOne(id)
            .then((result: Chat) => {
                if (!result) {
                    throw new NotFoundException("Chat not found");
                }
                return this.messagesService.findActivities(result.id);
            })
            .then((result: ActivityItemDto[]) => {
                ChatController.success(res, result);
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                ChatController.failure(res, error);
            });
    }

    @Post("read")
    @HttpCode(HttpStatus.OK)
    async readChatMessages(@Body() body, @Res() res): Promise<void> {
        return this.messagesService.readMessages(body)
            .then((result: MessageRead[]) => {
                ChatController.success(res, result);
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                ChatController.failure(res, error);
            });
    }

    @Post("messages")
    @HttpCode(HttpStatus.OK)
    @UsePipes(new JoiValidationPipe(ChatMessageSchema))
    async sendMessage(@Body() body: ChatMessageDto, @Res() res): Promise<void> {
        return this.messagesService.create(body.chatId, body.text, body.senderId, body.uuid)
            .then((result) => {
                if (!result) {
                    throw new InternalServerErrorException("Message not created");
                }
                ChatController.success(res, result);
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                ChatController.failure(res, error);
            });
    }
}
