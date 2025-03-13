import { Router } from 'express';
import * as userController from '../controller/userController';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/users', verifyToken, userController.getUsers);
router.post('/register', userController.register);
router.post('/login', userController.login);

export default router;