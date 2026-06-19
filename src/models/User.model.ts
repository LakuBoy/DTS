import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import { IUser } from '../types/user';

export class User extends Model<IUser> implements IUser {
  public id!: string;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public password_hash!: string;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    paranoid: true,
    underscored: true,
  }
);