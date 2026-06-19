import { Router } from 'express';
import { registerUser } from '../controllers/auth/auth.mutations';
import { loginUser } from '../controllers/auth/auth.queries';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;