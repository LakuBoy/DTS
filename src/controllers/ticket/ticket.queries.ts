import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { Ticket } from '../../models/Ticket.model';
import { TicketEvent } from '../../models/TicketEvent.model';
import { User } from '../../models/User.model';

export const getCompanyTickets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id!;
    const tickets = await Ticket.findAll({
      where: { company_id: companyId },
      order: [['updatedAt', 'DESC']],
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to query operational queue data' });
  }
};

export const getTicketAuditTrail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const trail = await TicketEvent.findAll({
      where: { ticket_id: id },
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'Modifier', attributes: ['first_name', 'last_name'] }],
    });
    res.json(trail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Timeline history event processing trace load failure' });
  }
};