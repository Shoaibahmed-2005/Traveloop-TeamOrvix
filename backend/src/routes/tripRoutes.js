import { Router } from 'express';
import { getTrips, getTrip, createTrip, updateTrip, deleteTrip, getTripSummary, toggleVisibility } from '../controllers/tripController.js';
import { tripValidator } from '../validators/tripValidator.js';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.get('/', getTrips);
router.post('/', tripValidator, validate, createTrip);
router.get('/:id', getTrip);
router.put('/:id', tripValidator, validate, updateTrip);
router.delete('/:id', deleteTrip);
router.get('/:id/summary', getTripSummary);
router.patch('/:id/visibility', toggleVisibility);

export default router;
