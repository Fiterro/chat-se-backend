export class UserSessionDto {
    constructor(readonly userId: number, readonly sessionId: number) {
    }

    get sessionRoom(): string {
        return ["session", this.sessionId].join(":");
    }

    get userRoom(): string {
        return ["user", this.userId].join(":");
    }
}
