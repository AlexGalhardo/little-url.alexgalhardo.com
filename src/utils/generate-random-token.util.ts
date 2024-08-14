import * as crypto from "node:crypto";

export default function generateRandomToken(tokenLength: number = 5): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let token = "";

    for (let i = 0; i < tokenLength; i++) {
        const randomIndex = crypto.randomInt(charactersLength);
        token += characters.charAt(randomIndex);
    }

    return token;
}
