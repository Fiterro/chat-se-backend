import { Provider } from "@nestjs/common";

import { REDIS_REPOS } from "../../app.constants";
import { Session } from "./session.entity";

export const SessionProviders: Provider[] = [
    {
        provide: REDIS_REPOS.SESSION,
        useValue: Session,
    },
];
