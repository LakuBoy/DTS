// Tracks incoming and outgoing call log details.

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import * as db from '../config/db';

export const logCallEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id;
    const agentId = req.user?.user_id;
    const { customer_id, ticket_id, call_direction, call_status, duration_seconds, recording_url } = req.body;

    const newCall = await db.query(
      `INSERT INTO calls (company_id, customer_id, agent_id, ticket_id, call_direction, call_status, duration_seconds, recording_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [companyId, customer_id, agentId, ticket_id || null, call_direction, call_status, duration_seconds || 0, recording_url || null]
    );

    res.status(201).json(newCall.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log call' });
  }
};

export const getCompanyCallHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id;
    const result = await db.query(
      `SELECT c.*, cu.phone_number, u.first_name as agent_name 
       FROM calls c
       LEFT JOIN customers cu ON c.customer_id = cu.customer_id
       LEFT JOIN users u ON c.agent_id = u.user_id
       WHERE c.company_id = $1 ORDER BY c.created_at DESC`,
      [companyId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch call log records' });
  }
};