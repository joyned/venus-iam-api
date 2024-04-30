import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export class Role extends Model {
    declare id: string;
    declare name: string;
    declare createdAt: Date;
}

Role.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'group'
});
