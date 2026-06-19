import { Router } from 'express';
import { createCompany, configureStatusWorkflow } from '../controllers/company/company.mutations';
import { getCompanyCustomStatuses } from '../controllers/company/company.queries';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', createCompany);
router.get('/statuses', authenticateToken, getCompanyCustomStatuses);
router.post('/statuses', authenticateToken, configureStatusWorkflow);

export default router;