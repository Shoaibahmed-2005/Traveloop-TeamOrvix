import { Router } from 'express';
import { getPublicItinerary } from '../controllers/publicController.js';

const router = Router();
router.get('/itinerary/:shareToken', getPublicItinerary);

export default router;
