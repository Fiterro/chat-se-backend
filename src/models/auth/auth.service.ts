import { Injectable } from "@nestjs/common";
import { google } from "googleapis";

import { config } from "../../../config";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

export const OAuth2 = google.auth.OAuth2;
export const plus = google.plus("v1");

@Injectable()
export class AuthService {
    private oauth2Client;
    private scopes = [
        "https://www.googleapis.com/auth/plus.me",
        "https://www.googleapis.com/auth/plus.login",
        "https://www.googleapis.com/auth/userinfo.email",
    ];

    constructor(private readonly userService: UserService) {
        this.oauth2Client = new OAuth2(
            config.googleAuth.GOOGLE_CONSUMER_KEY,
            config.googleAuth.GOOGLE_CONSUMER_SECRET,
            config.googleAuth.GOOGLE_CALLBACK_URL,
        );
    }

    async processAuthCode(code: string): Promise<User> {
        return this.oauth2Client.getToken(code)
            .then(response => {
                this.oauth2Client.setCredentials(response.tokens);
                return new Promise((resolve, reject) => {
                    plus.people.get({
                        userId: "me",
                        auth: this.oauth2Client,
                    }, (err, userInfo) => {
                        if (!err) {
                            const data = {
                                username: userInfo.data.displayName,
                                email: userInfo.data.emails[0].value,
                                firstName: userInfo.data.name.givenName,
                                lastName: userInfo.data.name.familyName,
                                avatar: userInfo.data.image.url.split(/[?#]/)[0],
                                googleId: userInfo.data.id,
                                refreshToken: response.tokens.refresh_token,
                            } as User;
                            resolve(data);
                        } else {
                            reject(err);
                        }
                    });
                });
            })
            .then(user => this.userService.findOrCreate(user));
    }

    async signup(): Promise<any> {
        return this.oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: this.scopes,
            prompt: "consent",
        });
    }
}
