import { Router } from 'express';
import { getChecklist, addItem, toggleItem, deleteItem, resetChecklist } from '../controllers/checklistController.js';
import { auth } from '../middleware/auth.js';

const router = Router({ mergeParams: true });
router.use(auth);

router.get('/', getChecklist);
router.post('/', addItem);
router.patch('/:id', toggleItem);
router.delete('/reset', resetChecklist);
router.delete('/:id', deleteItem);

export default router;
