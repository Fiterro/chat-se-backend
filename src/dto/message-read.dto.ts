export class MessageReadDto {
    constructor(readonly messageId: number,
                readonly userId: number,
                readonly countViews?: number) {
    }
}