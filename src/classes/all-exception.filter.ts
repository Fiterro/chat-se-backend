import { ArgumentsHost, Catch, HttpException, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception && (exception instanceof HttpException)
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        let exceptionMessage;
        if (exception instanceof HttpException) {
            exceptionMessage = exception.message.message;
        } else {
            exceptionMessage = exception.message ? exception.message : "Unknown internal error";
        }

        response
            .status(status)
            .json({
                status,
                message: exceptionMessage,
            });
    }
}