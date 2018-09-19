export interface ISessionService<T> {
    findSession(accessToken: string): Promise<T | null>;
}