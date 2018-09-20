import { Provider } from "@nestjs/common";

import { REDIS_REPOS } from "../../app.constants";
import { SessionEntity } from "./session.entity";

export const SessionProviders: Provider[] = [
    {
        provide: REDIS_REPOS.SESSION,
        useValue: SessionEntity,
    },
];
