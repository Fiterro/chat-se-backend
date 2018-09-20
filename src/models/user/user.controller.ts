import { Controller, Get, HttpStatus, Param, Res } from "@nestjs/common";
import { ServerController } from "../../classes/server-controller";

import { UserService } from "./user.service";

@Controller("users")
export class UserController extends ServerController {
    constructor(private readonly userService: UserService) {
        super();
    }

    @Get()
    async findAll(@Res() res) {
        return this.userService.findAll()
            .then((result) => {
                res.status(HttpStatus.OK);
                UserController.success(res, result
                    .map(user => user.toDTO()));
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                return UserController.failure(res, error);
            });
    }

    @Get("/:id")
    getOne(@Res() res, @Param() param) {
        const userId = parseInt(param.id, 10);
        if (!userId) {
            res.status(HttpStatus.FORBIDDEN);
            return UserController.failure(res, new Error("Invalid user id"));
        }
        return this.userService.getOne(userId)
            .then((result) => {
                if (!result) {
                    res.status(HttpStatus.NOT_FOUND);
                    return UserController.failure(res, new Error("User not found"));
                }
                res.status(HttpStatus.OK);
                return UserController.success(res, result.toDTO());
            })
            .catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                return UserController.failure(res, error);
            });
    }
}
