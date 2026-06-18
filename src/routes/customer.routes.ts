import { Router } from 'express';
import { getOrCreateCustomerByPhone, getCompanyCustomers } from '../controllers/customer.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken); // Protect all customer endpoints
router.get('/', getCompanyCustomers);
router.post('/lookup', getOrCreateCustomerByPhone);

export default router;