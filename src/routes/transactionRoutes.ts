import express from 'express';
import { authenticate, isAdmin } from '../middlewares/authMiddleware';
import { createTransaction, approveTransaction, getAllTransactions } from '../controllers/transactionController';

const router = express.Router();

router.post('/', authenticate, createTransaction);
router.put('/:id', authenticate, isAdmin, approveTransaction);
router.get('/', authenticate, isAdmin, getAllTransactions);

export default router;
