import { body } from 'express-validator';

export const registerValidator = [
  body('firstName').trim().isLength({ min: 2 }).matches(/^[a-zA-Z\s]+$/).withMessage('First name must be at least 2 letters'),
  body('lastName').trim().isLength({ min: 2 }).matches(/^[a-zA-Z\s]+$/).withMessage('Last name must be at least 2 letters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character'),
  body('phone').optional({ nullable: true, checkFalsy: true }).isMobilePhone().withMessage('Invalid phone format'),
  body('city').optional().isLength({ max: 100 }),
  body('country').optional().isLength({ max: 100 }),
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];
