import { Model, STRING } from "sequelize";
import { sequelize } from "../database";
import { Client } from "./Client";

export class ClientAllowedUrl extends Model {
    declare clientId: string;
    declare url: string;
    declare clients: Client[];
}

ClientAllowedUrl.init({
    id: {
        primaryKey: true,
        type: STRING
    },
    clientId: STRING,
    url: STRING
}, {
    sequelize,
    tableName: 'client_allowed_url',
});