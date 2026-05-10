import { body } from 'express-validator';

export const tripValidator = [
  body('title').trim().isLength({ min: 3, max: 255 }).withMessage('Title must be 3-255 characters'),
  body('startDate').isDate().withMessage('Valid start date required'),
  body('endDate').isDate().withMessage('Valid end date required')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate))
        throw new Error('End date must be after start date');
      return true;
    }),
  body('totalBudget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('description').optional().isLength({ max: 1000 }),
];
