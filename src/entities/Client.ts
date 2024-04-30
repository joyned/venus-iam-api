import { DATE, Model, STRING } from "sequelize";
import { sequelize } from "../database";
import { ClientAllowedUrl } from "./ClientAllowedUrl";

export class Client extends Model {
    declare id: string;
    declare name: string;
    declare url: string;
    declare clientSecret: string;
    declare allowedUrls: ClientAllowedUrl[];
    declare createdAt: Date;
}

Client.init({
    id: {
        type: STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: STRING,
    },
    url: {
        type: STRING,
    },
    clientSecret: {
        type: STRING,
    },
    createdAt: {
        type: DATE,
    },
}, {
    sequelize,
    tableName: 'client'
},);
