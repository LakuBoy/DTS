import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import * as db from '../config/db';

export const getCompanyTickets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id;
    // Strict tenant filtering using company_id and checking soft-deletes
    const result = await db.query(
      'SELECT * FROM tickets WHERE company_id = $1 AND deleted_at IS NULL ORDER BY updated_at DESC',
      [companyId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to query operational queue data' });
  }
};

export const createTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id;
    const creatorId = req.user?.id;
    const { assignee_id, title, description, status, priority } = req.body;

    const result = await db.query(
      `INSERT INTO tickets (company_id, creator_id, assignee_id, title, description, status, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [companyId, creatorId, assignee_id || null, title, description, status || 'open', priority || 'medium']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to insert ticket data' });
  }
};

export const updateTicketField = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id;
    const userId = req.user?.id;
    const { id } = req.params; // ticket id
    const { field_changed, old_value, new_value } = req.body;

    // Validate that the target field is safe to update
    const allowedFields = ['title', 'description', 'status', 'priority', 'assignee_id'];
    if (!allowedFields.includes(field_changed)) {
      res.status(400).json({ error: 'Invalid column field modification request' });
      return;
    }

    // Verify company scope ownership bounds
    const ticketCheck = await db.query('SELECT * FROM tickets WHERE id = $1 AND company_id = $2', [id, companyId]);
    if (ticketCheck.rows.length === 0) {
      res.status(404).json({ error: 'Ticket profile entry missing or invalid tenant target context' });
      return;
    }

    // Safely update the dynamic column configuration change
    await db.query(`UPDATE tickets SET ${field_changed} = $1, updated_at = NOW() WHERE id = $2`, [new_value, id]);

    // Track state into historical paper trail audit log (ticket_events)
    const auditLog = await db.query(
      `INSERT INTO ticket_events (ticket_id, changed_by_user_id, field_changed, old_value, new_value)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, userId, field_changed, old_value?.toString() || null, new_value?.toString() || null]
    );

    res.json({ message: 'Ticket track state modified', event: auditLog.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Audit pipeline processing update exception' });
  }
};

export const softDeleteTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id;
    const { id } = req.params;

    const result = await db.query(
      'UPDATE tickets SET deleted_at = NOW() WHERE id = $1 AND company_id = $2 RETURNING id',
      [id, companyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Ticket profile target missing or outside authorized tenant constraints' });
      return;
    }
    res.json({ message: 'Ticket profile safely soft-deleted from live views' });
  } catch (error) {
    res.status(500).json({ error: 'Soft deletion execution processing failure' });
  }
};

export const getTicketAuditTrail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT te.*, u.first_name, u.last_name FROM ticket_events te
       LEFT JOIN users u ON te.changed_by_user_id = u.id
       WHERE te.ticket_id = $1 ORDER BY te.created_at DESC`,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Timeline historical logging parsing failure' });
  }
};