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

    public static failure(res: Response, error: HttpException) {
        const response: ApiResponse = {
            status: error ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
            data: error ? error.message.message : "Unknown internal error",
        };
        res.status(response.status);

        return res.send(response);
    }
}
