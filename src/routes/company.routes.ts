import { Router } from 'express';
import { createCompany, getCompanyCustomStatuses, configureStatusWorkflow } from '../controllers/company.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', createCompany); 
router.get('/statuses', authenticateToken, getCompanyCustomStatuses);
router.post('/statuses', authenticateToken, configureStatusWorkflow);

export default router;