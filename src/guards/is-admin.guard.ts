import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { UserService } from "../models/user/user.service";
import { config } from "../../config";

@Injectable()
export class IsAdminGuard implements CanActivate {
    constructor(private readonly userService: UserService) {
    }

    canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.userService.getOne(request.session.userId)
            .then((user) => {
                if (!user) {
                    return false;
                }

                const googleId = Number(user.googleId);
                const adminGoogleKeys = config.admin.googleKeys;
                // @ts-ignore
                return adminGoogleKeys.includes(googleId);
            })
            .catch(() => {
                return false;
            });
    }
}
