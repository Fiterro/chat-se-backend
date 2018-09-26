import { MessageDto } from "./message.dto";

export class MessageListDto {
    readonly data: MessageDto[];
    readonly pagination: { total: number };

    constructor(data: MessageDto[], total: number = 0) {
        if (data) {
            this.data = data;
        }

        if (total !== undefined) {
            this.pagination = {total};
        }
    }
}
