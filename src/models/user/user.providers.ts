import { SEQUELIZE_REPOS } from "../../app.constants";
import { User } from "./user.entity";

export const UserProviders = [
    {
        provide: SEQUELIZE_REPOS.USERS,
        useValue: User,
    },
];
