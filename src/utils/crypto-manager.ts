import { createHmac } from "crypto";
import { genSaltSync, hashSync, compareSync } from "bcrypt";

export class CryptoManager {
    static genToken(userId: number, salt: string): string {
        return createHmac("sha256", [userId, Date.now(), salt].join("/"))
            .digest("hex");
    }

    static hashPass(pass: string): string {
        return hashSync(pass, genSaltSync());
    }

    static verifyPass(pass: string, hash: string): boolean {
        return compareSync(pass, hash);
    }
}
