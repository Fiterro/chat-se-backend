import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer() server: Server;

    // TODO: implement read message mechanism
    @SubscribeMessage("read")
    onEvent(client: Socket, data: any): void{
    }
}
