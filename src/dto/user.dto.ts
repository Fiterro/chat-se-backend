export class UserDto {
    readonly id: number;
    readonly username: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly avatar: string;
    readonly googleId: string;

    constructor(id: number, username: string, email: string, firstName: string, lastName: string, avatar: string, googleId: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatar = avatar;
        this.googleId = googleId;
    }
}