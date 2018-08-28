export class ActivityItemDto {
    readonly timestamp: string;
    readonly participants: any[];

    constructor({timestamp, participants}) {
        this.timestamp = timestamp;
        this.participants = participants;
    }
}
