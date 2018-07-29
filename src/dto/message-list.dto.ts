import { MessageDto } from "./message.dto";

export class MessageListDto {
    readonly data: MessageDto[];
    readonly pagination: { total: number };

    constructor(data: MessageDto[], total: number) {
        if (data) {
            this.data = data;
        }

        if (total) {
            this.pagination = {total};
        }
    }
}
