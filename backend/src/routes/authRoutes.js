import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe, logout, updateProfile } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { success: false, message: 'Too many requests' } });

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);
router.put('/profile', auth, updateProfile);

export default router;
