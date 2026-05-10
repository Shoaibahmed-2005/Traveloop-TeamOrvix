import { Router } from 'express';
import { getStats, getUsers, getAllTrips, toggleUserStatus } from '../controllers/adminController.js';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = Router();
router.use(auth, isAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/trips', getAllTrips);
router.patch('/users/:id/status', toggleUserStatus);

export default router;
