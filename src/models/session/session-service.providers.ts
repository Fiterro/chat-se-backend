import { CustomFactory } from "@nestjs/core/injector/module";
import { SessionService } from "./session.service";
import { SESSION_SERVICE_TOKEN } from "../../app.constants";

export const SessionServiceProviders: CustomFactory = {
    name: "SessionService",
    provide: SESSION_SERVICE_TOKEN,
    useFactory: (userSessionsService: SessionService) => {
        return [
            userSessionsService,
        ];
    },
    inject: [SessionService],
};