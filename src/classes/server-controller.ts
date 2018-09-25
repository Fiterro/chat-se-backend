import { Response } from "express";

import { ApiResponse } from "../interfaces/api-response";
import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Base controller class
 */
export class ServerController {
    public static success(res: Response, data: any, meta?: any): Response {
        const response: ApiResponse = {
            status: 200,
            data,
        };

        if (meta) {
            response.pagination = meta;
        }

        return res.send(response);
    }

    public static failure(res: Response, exception: any) {
        const status = exception && (exception instanceof HttpException)
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        let exceptionMessage;
        if (exception instanceof HttpException) {
            exceptionMessage = exception.message.message;
        } else {
            exceptionMessage = exception.message ? exception.message : "Unknown internal error";
        }
        const response: ApiResponse = {
            status,
            data: exceptionMessage,
        };
        res.status(response.status);

        return res.send(response);
    }
}
