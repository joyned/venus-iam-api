import { sequelize } from "../database";

const { DataTypes, Model } = require('sequelize');
const Group = require('./Group');

export class User extends Model {
    declare id: string;
    declare name: string;
    declare email: string;
    declare password: string;
    declare createdAt: Date;
    declare isBlocked: Boolean;
}

User.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    isBlocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'user'
});

