import { Router } from 'express';
import { getCompanyTickets, createTicket, updateTicketField, softDeleteTicket, getTicketAuditTrail } from '../controllers/ticket.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);
router.get('/', getCompanyTickets);
router.post('/', createTicket);
router.patch('/:id', updateTicketField);
router.delete('/:id', softDeleteTicket);
router.get('/:id/events', getTicketAuditTrail);

export default router;