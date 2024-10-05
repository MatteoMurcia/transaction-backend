import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = new Transaction({ userId: req.user?.id, amount: req.body.amount });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const approveTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(id, { status }, { new: true });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
