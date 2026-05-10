import { Router } from 'express';
import { getActivities, getActivityById, addActivityToStop, removeActivityFromStop } from '../controllers/activityController.js';
import { cacheMiddleware } from '../middleware/cache.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', cacheMiddleware(300), getActivities);
router.get('/:id', cacheMiddleware(300), getActivityById);

export default router;
