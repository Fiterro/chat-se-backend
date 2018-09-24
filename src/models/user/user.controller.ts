import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Res, UnprocessableEntityException } from "@nestjs/common";
import { ServerController } from "../../classes/server-controller";

import { UserService } from "./user.service";

@Controller("users")
export class UserController extends ServerController {
    constructor(private readonly userService: UserService) {
        super();
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Res() res) {
        return this.userService.findAll()
            .then((result) => {
                UserController.success(res, result.map(user => user.toDTO()));
            })
            .catch((error) => {
                return UserController.failure(res, error);
            });
    }

    @Get("/:id")
    @HttpCode(HttpStatus.OK)
    getOne(@Param("id") id, @Res() res) {
        if (!id) {
            throw new UnprocessableEntityException("Invalid user id");
        }
        const userId = parseInt(id, 10);
        return this.userService.getOne(userId)
            .then((result) => {
                if (!result) {
                    throw new NotFoundException("User not found");
                }
                return UserController.success(res, result.toDTO());
            })
            .catch((error) => {
                return UserController.failure(res, error);
            });
    }
}
