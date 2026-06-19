import { Router } from 'express';
import { createTicket, updateTicketField, softDeleteTicket } from '../controllers/ticket/ticket.mutations';
import { getCompanyTickets, getTicketAuditTrail } from '../controllers/ticket/ticket.queries';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);
router.get('/', getCompanyTickets);
router.post('/', createTicket);
router.patch('/:id', updateTicketField);
router.delete('/:id', softDeleteTicket);
router.get('/:id/events', getTicketAuditTrail);

export default router;