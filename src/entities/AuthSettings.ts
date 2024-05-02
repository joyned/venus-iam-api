
export class AuthSettings {
    declare tokenDurability: number;
    declare generateRefreshToken: boolean;
    declare jwtSecret?: string;

    constructor(data?: any) {
        if (data) {
            this.tokenDurability = data.token_durability;
            this.generateRefreshToken = data.generate_refresh_token;
            this.jwtSecret = data.jwt_secret;
        }
    }
}