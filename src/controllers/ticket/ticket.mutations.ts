import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { Ticket } from '../../models/Ticket.model';
import { TicketEvent } from '../../models/TicketEvent.model';

export const createTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id!;
    const creatorId = req.user?.id!;
    const { assignee_id, title, description, status, priority } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const result = await Ticket.create({
      company_id: companyId,
      creator_id: creatorId,
      assignee_id: assignee_id || null,
      title,
      description: description || null,
      status: status || 'open',
      priority: priority || 'medium',
    } as any);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to insert ticket data' });
  }
};

export const updateTicketField = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id!;
    const userId = req.user?.id!;
    const { id } = req.params;
    const { field_changed, old_value, new_value } = req.body;

    const allowedFields = ['title', 'description', 'status', 'priority', 'assignee_id'];
    if (!allowedFields.includes(field_changed)) {
      res.status(400).json({ error: 'Invalid column modification target request' });
      return;
    }

    const ticket = await Ticket.findOne({ where: { id, company_id: companyId } });
    if (!ticket) {
      res.status(404).json({ error: 'Ticket profile entry matching tenant target context missing' });
      return;
    }

    const previousValue = ticket.get(field_changed as keyof Ticket) as any;
    ticket.set(field_changed as any, new_value);
    await ticket.save();

    const auditLog = await TicketEvent.create({
      ticket_id: id,
      changed_by_user_id: userId,
      field_changed,
      old_value: previousValue?.toString() || null,
      new_value: new_value?.toString() || null,
    } as any);

    res.json({ message: 'Ticket track state modified successfully', event: auditLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Audit log event processing update failure exception' });
  }
};

export const softDeleteTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.company_id!;
    const { id } = req.params;

    const ticket = await Ticket.findOne({
      where: { id, company_id: companyId },
      paranoid: true,
    });

    if (!ticket) {
      res.status(404).json({ error: 'Ticket target profile missing inside tenant workspace' });
      return;
    }

    await ticket.destroy();

    res.json({ message: 'Ticket profile safely soft-deleted from operational view maps' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Soft deletion execution processing failure' });
  }
};