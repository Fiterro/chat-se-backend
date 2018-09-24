export class SessionDto {
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly expiresAt: number;

    constructor(accessToken: string, refreshToken: string, lifeTime: number) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        const expiresAt = new Date(Date.now() + lifeTime * 1000);
        this.expiresAt = Math.fround(expiresAt.getTime() / 1000); // transform ms to s
    }
}