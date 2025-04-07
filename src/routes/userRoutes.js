import { Router } from 'express';
import * as userController from '../controller/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/users', verifyToken, userController.getUsers);
router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/reset-password', userController.resetPasswordEmail);

router.post('/reset-password/:resetToken', userController.resetPassword);

export default router;