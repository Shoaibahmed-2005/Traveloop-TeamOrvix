import { Router } from 'express';
import { getBudget, addExpense, getExpenses, updateExpense, deleteExpense } from '../controllers/budgetController.js';
import { auth } from '../middleware/auth.js';

const router = Router({ mergeParams: true });
router.use(auth);

router.get('/budget', getBudget);
router.post('/expenses', addExpense);
router.get('/expenses', getExpenses);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

export default router;
