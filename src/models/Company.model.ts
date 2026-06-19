import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import { ICompany } from '../types/company';

export class Company extends Model<ICompany> implements ICompany {
  public id!: string;
  public name!: string;
}

Company.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Company',
    tableName: 'companies',
    underscored: true,
  }
);