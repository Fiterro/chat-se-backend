import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { SocketEvent } from "./event.enum";

@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer() server: Server;

    emitEvent(eventType: SocketEvent, data: any): void {
        this.server.emit(eventType, data);
    }
}
