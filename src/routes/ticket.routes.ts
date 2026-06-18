import { Router } from 'express';
import { getCompanyTickets, createTicket, updateTicketStatus, getTicketTimeline } from '../controllers/ticket.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);
router.get('/', getCompanyTickets);
router.post('/', createTicket);
router.patch('/:id/status', updateTicketStatus);
router.get('/:id/timeline', getTicketTimeline);

export default router;