import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import { ITicket } from '../types/ticket';

export class Ticket extends Model<ITicket> implements ITicket {
  public id!: string;
  public company_id!: string;
  public creator_id!: string;
  public assignee_id!: string | null;
  public title!: string;
  public description!: string | null;
  public status!: string;
  public priority!: string;
}

Ticket.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    company_id: { type: DataTypes.UUID, allowNull: false },
    creator_id: { type: DataTypes.UUID, allowNull: false },
    assignee_id: { type: DataTypes.UUID, allowNull: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING(50), defaultValue: 'open' },
    priority: { type: DataTypes.STRING(20), defaultValue: 'medium' },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Ticket',
    tableName: 'tickets',
    paranoid: true,
    underscored: true,
  }
);