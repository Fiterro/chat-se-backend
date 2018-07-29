import { Pagination } from "../types/pagination.type";

export class PaginationDto {
    readonly limit?: number;
    readonly offset?: number;

    constructor(data: Pagination) {
        if (data.limit) {
            this.limit = data.limit;
        }

        if (data.offset) {
            this.offset = data.offset;
        }
    }
}
