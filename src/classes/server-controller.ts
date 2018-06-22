import { Response } from "express";

import { ApiResponse } from "../interfaces/api-response";

/**
 * Base controller class
 */
export class ServerController {
    public static success(res: Response, data: any) {
        const response: ApiResponse = {
            status: 200,
            data,
        };

        return res.send(response);
    }

    public static failure(res: Response, error: Error) {
        const response: ApiResponse = {
            status: 500,
            data: error ? error.message : "Unknown internal error",
        };

        return res.send(response);
    }
}
