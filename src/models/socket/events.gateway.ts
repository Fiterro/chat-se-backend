import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

import { SocketService } from "./socket.service";
import { filter } from "rxjs/operators";

@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly socketService: SocketService) {
        this.createEventSubscription();
    }

    createEventSubscription(): void {
        this.socketService.eventEmitter
            .pipe(
                filter((data) => !!data),
            )
            .subscribe(([event, payload]) => {
                // TODO: solve problem: this.server = null;
                this.server.emit(event, payload);
            });
    }
}
