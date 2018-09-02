import {Module} from "@nestjs/common";

import {DatabaseModule} from "../../utils/database/database.module";
import {EventsGateway} from "./events.gateway";
import {SocketService} from "./socket.service";

@Module({
    imports: [
        DatabaseModule,
    ],
    providers: [
        EventsGateway,
        SocketService,
    ],
    exports: [
        SocketService,
    ],
})
export class SocketModule {
}
