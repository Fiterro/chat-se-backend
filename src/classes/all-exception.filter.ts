import { ArgumentsHost, Catch, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();

        response
            .status(status)
            .json({
                status: status ? status : HttpStatus.INTERNAL_SERVER_ERROR,
                message: exception ? exception.message.message : "Unknown internal error",
            });
    }
}