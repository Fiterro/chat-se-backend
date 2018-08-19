export class ChatMessageDto {
    readonly chatId: number;
    readonly text: string;
    readonly senderId: number;
    readonly sentAt: Date;

    constructor(chatId: number, text: string, senderId: number, sentAt?: string) {
        this.chatId = chatId;
        this.text = text;
        this.senderId = senderId;
        this.sentAt = sentAt ? new Date(sentAt) : new Date();
    }
}
