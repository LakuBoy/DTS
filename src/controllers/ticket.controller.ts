import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import * as db from '../config/db';

export const getCompanyTickets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id;
    const result = await db.query('SELECT * FROM tickets WHERE company_id = $1 ORDER BY updated_at DESC', [companyId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tickets' });
  }
};

export const createTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id;
    const { customer_id, assigned_to, subject, description, priority } = req.body;

    const result = await db.query(
      `INSERT INTO tickets (company_id, customer_id, assigned_to, subject, description, priority)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [companyId, customer_id, assigned_to, subject, description, priority]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};

export const updateTicketStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id;
    const userId = req.user?.user_id;
    const { id } = req.params; // ticket_id
    const { status, note_text } = req.body;

    // 1. Verify ticket belongs to company
    const ticketCheck = await db.query('SELECT * FROM tickets WHERE ticket_id = $1 AND company_id = $2', [id, companyId]);
    if (ticketCheck.rows.length === 0) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    // 2. Update status
    const updatedTicket = await db.query(
      'UPDATE tickets SET status = $1 WHERE ticket_id = $2 RETURNING *',
      [status, id]
    );

    // 3. Log into ticket_updates history table
    await db.query(
      `INSERT INTO ticket_updates (ticket_id, author_id, update_type, note_text)
       VALUES ($1, $2, 'status_change', $3)`,
      [id, userId, note_text || `Status updated to ${status}`]
    );

    res.json(updatedTicket.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket' });
  }
};

export const getTicketTimeline = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT tu.*, u.first_name, u.last_name FROM ticket_updates tu
       LEFT JOIN users u ON tu.author_id = u.user_id
       WHERE tu.ticket_id = $1 ORDER BY tu.created_at ASC`,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timeline history' });
  }
};