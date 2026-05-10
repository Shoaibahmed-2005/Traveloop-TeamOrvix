import { Router } from 'express';
import { getNotes, addNote, updateNote, deleteNote } from '../controllers/noteController.js';
import { auth } from '../middleware/auth.js';

const router = Router({ mergeParams: true });
router.use(auth);

router.get('/', getNotes);
router.post('/', addNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
