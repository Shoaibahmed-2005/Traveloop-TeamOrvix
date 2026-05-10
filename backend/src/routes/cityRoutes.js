import { Router } from 'express';
import { getCities, getPopularCities, getRegions, getCityById } from '../controllers/cityController.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = Router();

router.get('/', cacheMiddleware(300), getCities);
router.get('/popular', cacheMiddleware(600), getPopularCities);
router.get('/regions', cacheMiddleware(1800), getRegions);
router.get('/:id', cacheMiddleware(300), getCityById);

export default router;
