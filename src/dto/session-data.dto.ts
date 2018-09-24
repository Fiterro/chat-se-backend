import { SessionDto } from "./session.dto";
import { UserDto } from "./user.dto";

export class SessionDataDto {
    readonly session: SessionDto;
    readonly profile: UserDto;

    constructor(session: SessionDto, user: UserDto) {
        this.session = session;
        this.profile = user;
    }
}
