import { Model, STRING } from "sequelize";
import { sequelize } from "../database";

export class System extends Model {
    declare id: string;
    declare version: string;
}

System.init({
    id: {
        type: STRING,
        primaryKey: true
    },
    version: {
        type: STRING,
    }
}, {
    sequelize,
    tableName: 'system'
});