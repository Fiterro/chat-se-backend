import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../utils/database/database.module";
import { UserController } from "./user.controller";
import { UserProviders } from "./user.providers";
import { UserService } from "./user.service";

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [
        UserService,
        ...UserProviders,
    ],
    exports: [UserService],
})
export class UserModule {
}
