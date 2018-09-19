import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if (!request.session) {
            throw new Error("Token has expired");
        }

        const allowedSessions = this.reflector.get("allowedSessions", context.getHandler());
        Logger.warn(allowedSessions);
        if (allowedSessions && allowedSessions.length) {
            return allowedSessions
                .reduce((result: boolean, Session): boolean => result || request.session instanceof Session, false);
        }

        return true;
    }
}
