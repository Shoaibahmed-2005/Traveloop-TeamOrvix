import { Router } from 'express';
import { getPosts, publishTrip, likePost, getPost } from '../controllers/communityController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', getPosts);
router.get('/:postId', getPost);
router.post('/:tripId/publish', auth, publishTrip);
router.post('/:postId/like', likePost);

export default router;
