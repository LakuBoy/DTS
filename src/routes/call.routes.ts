import { Router } from 'express';
import { logCallEvent, getCompanyCallHistory } from '../controllers/call.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);
router.get('/', getCompanyCallHistory);
router.post('/', logCallEvent);

export default router;