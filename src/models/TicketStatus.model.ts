import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import { ITicketStatus } from '../types/ticketStatus';

export class TicketStatus extends Model<ITicketStatus> implements ITicketStatus {
  public id!: string;
  public company_id!: string;
  public name!: string;
  public sort_order!: number;
}

TicketStatus.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    company_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING(50), allowNull: false },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: 'TicketStatus',
    tableName: 'ticket_statuses',
    timestamps: false,
    underscored: true,
  }
);