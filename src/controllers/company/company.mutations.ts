import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { Company } from '../../models/Company.model';
import { TicketStatus } from '../../models/TicketStatus.model';

export const createCompany = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const result = await Company.create({
        name,
        id: ''
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create company organizational scope' });
  }
};

export const configureStatusWorkflow = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id!;
    const { name, sort_order } = req.body;

    const result = await TicketStatus.create({
        company_id: companyId,
        name,
        sort_order: sort_order || 0,
        id: ''
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate custom workflow status' });
  }
};