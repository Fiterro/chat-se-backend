import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { MessagesService } from "../message/message.service";
import { ChatMessageDto } from "../../dto/chat-message.dto";
import { InternalServerErrorException, Logger, UsePipes } from "@nestjs/common";
import { JoiValidationPipe } from "../../pipes/joi-validation.pipe";
import { ChatMessageSchema } from "../../schemas/chat-message.schema";
import { ChatMessage } from "../chat-message/chat-message.entity";
import { MessageDto } from "../../dto/message.dto";

@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly messagesService: MessagesService) {
    }

    @SubscribeMessage("createMessage")
    @UsePipes(new JoiValidationPipe(ChatMessageSchema))
    onCreateMessageEvent(client, data: ChatMessageDto): Promise<void> {
        return this.messagesService.create(data.chatId, data.text, data.senderId)
            .then((result: ChatMessage) => {
                if (!result) {
                    throw new InternalServerErrorException("Message not created");
                }
                return this.messagesService.findOne(result.messageId);
            })
            .then((result: MessageDto) => {
                this.server.emit("message", result);
            })
            .catch((error) => Logger.error(error));
    }
}
