import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { Role } from './Role';

export class Group extends Model {
    declare id: string;
    declare name: string;
    declare createdAt: Date;
    declare lastUpdate: Date;
    declare roles: Role[];
}

Group.init({
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
    lastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'group'
});
