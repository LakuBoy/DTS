import { Company } from './Company.model';
import { User } from './User.model';
import { Ticket } from './Ticket.model';
import { TicketStatus } from './TicketStatus.model';
import { TicketEvent } from './TicketEvent.model';
import { UserCompanyRole } from './UserCompanyRole.model';

export const initAssociations = () => {
  // User <-> Company via UserCompanyRole
  User.belongsToMany(Company, {
    through: UserCompanyRole,
    foreignKey: 'user_id',
    otherKey: 'company_id',
  });
  Company.belongsToMany(User, {
    through: UserCompanyRole,
    foreignKey: 'company_id',
    otherKey: 'user_id',
  });

  // Tickets
  Company.hasMany(Ticket, { foreignKey: 'company_id' });
  Ticket.belongsTo(Company, { foreignKey: 'company_id' });

  User.hasMany(Ticket, { foreignKey: 'creator_id', as: 'CreatedTickets' });
  User.hasMany(Ticket, { foreignKey: 'assignee_id', as: 'AssignedTickets' });
  Ticket.belongsTo(User, { foreignKey: 'creator_id', as: 'Creator' });
  Ticket.belongsTo(User, { foreignKey: 'assignee_id', as: 'Assignee' });

  // Ticket Statuses
  Company.hasMany(TicketStatus, { foreignKey: 'company_id' });
  TicketStatus.belongsTo(Company, { foreignKey: 'company_id' });

  // Ticket Events
  Ticket.hasMany(TicketEvent, { foreignKey: 'ticket_id' });
  TicketEvent.belongsTo(Ticket, { foreignKey: 'ticket_id' });
  TicketEvent.belongsTo(User, { foreignKey: 'changed_by_user_id', as: 'Modifier' });
};