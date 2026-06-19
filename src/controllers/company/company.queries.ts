import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { TicketStatus } from '../../models/TicketStatus.model';

export const getCompanyCustomStatuses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id!;
    const statuses = await TicketStatus.findAll({
      where: { company_id: companyId },
      order: [['sort_order', 'ASC']],
    });
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status configurations' });
  }
};