import { Router } from 'express';
import { getStops, addStop, updateStop, deleteStop, reorderStops, getSections, addSection, updateSection, deleteSection } from '../controllers/itineraryController.js';
import { auth } from '../middleware/auth.js';

const router = Router({ mergeParams: true });
router.use(auth);

router.get('/stops', getStops);
router.post('/stops', addStop);
router.put('/stops/reorder', reorderStops);
router.put('/stops/:stopId', updateStop);
router.delete('/stops/:stopId', deleteStop);
router.get('/stops/:stopId/sections', getSections);
router.post('/stops/:stopId/sections', addSection);
router.put('/stops/:stopId/sections/:sectionId', updateSection);
router.delete('/stops/:stopId/sections/:sectionId', deleteSection);

export default router;
