export class ChatMessageDto {
    readonly chatId: number;
    readonly text: string;
    readonly senderId: number;
    readonly uuid: string;
    readonly sentAt: Date;

    constructor(chatId: number, text: string, senderId: number, uuid: string, sentAt?: string) {
        this.chatId = chatId;
        this.text = text;
        this.senderId = senderId;
        this.uuid = uuid;
        this.sentAt = sentAt ? new Date(sentAt) : new Date();
    }
}
