import {
    Body,
    ConflictException,
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
    Session,
    UnprocessableEntityException,
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
import { IsAdminGuard } from "../../guards/is-admin.guard";
import { ChatMessage } from "../chat-message/chat-message.entity";
import { EventsGateway } from "../socket/events.gateway";
import { SocketEvent } from "../socket/event.enum";

@Controller("chats")
@AllowSessions(UserSessionDto)
@UseGuards(AuthGuard)
export class ChatController extends ServerController {
    constructor(private readonly chatService: ChatService,
                private readonly messagesService: MessagesService,
                private readonly eventsGateway: EventsGateway) {
        super();
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Res() res): Promise<void> {
        return this.chatService.findAll()
            .then((result) => {
                ChatController.success(res, result);
            })
            .catch((error) => {
                ChatController.failure(res, error);
            });
    }

    @Post()
    @UseGuards(IsAdminGuard)
    @UsePipes(new JoiValidationPipe(ChatSchema))
    @HttpCode(HttpStatus.CREATED)
    async createChat(@Body() body, @Res() res): Promise<void> {
        const chatName = body.name.trim();
        return this.chatService.findByName(chatName)
            .then((chat) => {
                if (chat) {
                    throw new ConflictException("Chat already exist");
                }
                return this.chatService.create(chatName);
            })
            .then((result) => {
                ChatController.success(res, result);
            })
            .catch((error) => {
                ChatController.failure(res, error);
            });
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async findOne(@Param("id") id, @Res() res): Promise<void> {
        if (!id) {
            throw new UnprocessableEntityException("Invalid user id");
        }
        return this.chatService.getOne(id)
            .then((result) => {
                if (!result) {
                    throw new NotFoundException("Chat not found");
                }
                ChatController.success(res, result);
            })
            .catch((error) => {
                ChatController.failure(res, error);
            });
    }

    @Get(":id/messages")
    @HttpCode(HttpStatus.OK)
    async getMessagesByChatId(@Res() res, @Param("id") id, @Query() query: Pagination, @Session() session: UserSessionDto): Promise<void> {
        if (!id) {
            throw new UnprocessableEntityException("Invalid user id");
        }
        return this.chatService.getOne(id)
            .then((result: Chat) => {
                if (!result) {
                    throw new NotFoundException("Chat not found");
                }
                return this.messagesService.findByChatId(result.id, new PaginationDto(query), session.userId);
            })
            .then((result: MessageListDto) => {
                ChatController.success(res, result.data, result.pagination);
            })
            .catch((error) => {
                ChatController.failure(res, error);
            });
    }

    @Get(":id/activity")
    @HttpCode(HttpStatus.OK)
    async getActivityByChatId(@Res() res, @Param("id") id, @Query() query: Pagination): Promise<void> {
        if (!id) {
            throw new UnprocessableEntityException("Invalid user id");
        }
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
                ChatController.failure(res, error);
            });
    }

    @Post("read")
    @HttpCode(HttpStatus.OK)
    async readChatMessages(@Body() body, @Session() session: UserSessionDto, @Res() res): Promise<void> {
        return this.messagesService.readMessages(body, session.userId)
            .then((result: MessageRead[]) => {
                ChatController.success(res, result);
            })
            .catch((error) => {
                ChatController.failure(res, error);
            });
    }

    @Post("messages")
    @HttpCode(HttpStatus.OK)
    @UsePipes(new JoiValidationPipe(ChatMessageSchema))
    async sendMessage(@Body() body: ChatMessageDto, @Res() res, @Session() session: UserSessionDto): Promise<void> {
        return this.messagesService.create(body.chatId, body.text, session.userId, body.uuid)
            .then((result: ChatMessage) => {
                if (!result) {
                    throw new InternalServerErrorException("Message not created");
                }
                return this.messagesService.readMessages([result.id], session.userId);
            })
            .then((result) => {
                return this.messagesService.findOne(result[0].messageId, result[0].countViews);
            })
            .then((result) => {
                this.eventsGateway.server.emit(SocketEvent.Message, result);
                ChatController.success(res, result);
            })
            .catch((error) => {
                ChatController.failure(res, error);
            });
    }
}
