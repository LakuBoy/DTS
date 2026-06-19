import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import { IUserCompanyRole } from '../types/UserCompanyRole';
import { UserRole } from '../types/userRole';

export class UserCompanyRole extends Model<IUserCompanyRole> implements IUserCompanyRole {
  public user_id!: string;
  public company_id!: string;
  public role!: UserRole; // Cast to the specific UserRole enum type instead of a generic string
}

UserCompanyRole.init(
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: 'users', key: 'id' },
    },
    company_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: 'companies', key: 'id' },
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'client_admin', 'client', 'client_receivers_admin', 'client_receivers'),
      allowNull: false,
    },
  },
  { sequelize, modelName: 'UserCompanyRole', tableName: 'user_company_roles', timestamps: false }
);