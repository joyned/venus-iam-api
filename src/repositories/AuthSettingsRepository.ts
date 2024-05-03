import { AuthSettings } from "../entities/AuthSettings";
import { executeQuery } from "./BaseRepository";

const FIND = `SELECT token_durability, generate_refresh_token, jwt_secret FROM venus.auth_settings`;
const INSERT = `INSERT INTO venus.auth_settings(token_durability, generate_refresh_token, jwt_secret) VALUES ($1, $2, $3)`
const UPDATE = `UPDATE venus.auth_settings SET token_durability=$1, generate_refresh_token=$2`

export class AuthSettingsRepository {
     async find() {
        const result = await executeQuery(FIND);
        return result.rows[0];
    }

     async update(authSettings: AuthSettings) {
        const result = await executeQuery(UPDATE, [authSettings.tokenDurability, authSettings.generateRefreshToken]);
        if (result.rowCount == 1) {
            return authSettings;
        }

        return undefined;
    }

     async save(authSettings: AuthSettings) {
        const result = await executeQuery(INSERT, [authSettings.tokenDurability, authSettings.generateRefreshToken, authSettings.jwtSecret]);
        if (result.rowCount == 1) {
            return authSettings;
        }

        return undefined;
    }
}