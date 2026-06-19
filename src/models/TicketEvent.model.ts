import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import { ITicketEvent } from '../types/ticketEvent';

export class TicketEvent extends Model<ITicketEvent> implements ITicketEvent {
  public id!: string;
  public ticket_id!: string;
  public changed_by_user_id!: string;
  public field_changed!: string;
  public old_value!: string | null;
  public new_value!: string | null;
}

TicketEvent.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ticket_id: { type: DataTypes.UUID, allowNull: false },
    changed_by_user_id: { type: DataTypes.UUID, allowNull: false },
    field_changed: { type: DataTypes.STRING(50), allowNull: false },
    old_value: { type: DataTypes.TEXT, allowNull: true },
    new_value: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: 'TicketEvent',
    tableName: 'ticket_events',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  }
);