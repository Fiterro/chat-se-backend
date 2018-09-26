import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if (!request.session) {
            throw new UnauthorizedException("Invalid access token");
        }

        const allowedSessions = this.reflector.get<Function[]>("allowedSessions", context.getHandler());
        if (allowedSessions && allowedSessions.length) {
            return allowedSessions
                .reduce((result: boolean, Session): boolean => result || request.session instanceof Session, false);
        }

        return true;
    }
}
