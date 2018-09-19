import { Controller, Inject } from "@nestjs/common";

import { SessionService } from "./session.service";
import { Session } from "./session.entity";
import { REDIS_REPOS } from "../../app.constants";

@Controller("sessions")
export class SessionController {
    constructor(@Inject(REDIS_REPOS.SESSION) private readonly sessions: typeof Session,
                private readonly sessionService: SessionService) {
    }
}