import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import * as db from '../config/db';

export const createCompany = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const result = await db.query('INSERT INTO companies (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create company organizational scope' });
  }
};

export const getCompanyCustomStatuses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id;
    const result = await db.query(
      'SELECT * FROM ticket_statuses WHERE company_id = $1 ORDER BY sort_order ASC',
      [companyId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status configurations' });
  }
};

export const configureStatusWorkflow = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id;
    const { name, sort_order } = req.body;

    const result = await db.query(
      `INSERT INTO ticket_statuses (company_id, name, sort_order)
       VALUES ($1, $2, $3) RETURNING *`,
      [companyId, name, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate custom workflow step' });
  }
};