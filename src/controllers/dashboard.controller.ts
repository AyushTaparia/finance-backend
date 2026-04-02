import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../db';

export const getSummary = async (req: AuthRequest, res: Response) => {
    try {
        const records = await prisma.record.findMany();

        let totalIncome = 0;
        let totalExpense = 0;

        records.forEach(r => {
            if (r.type === 'Income') totalIncome += r.amount;
            if (r.type === 'Expense') totalExpense += r.amount;
        });

        const netBalance = totalIncome - totalExpense;

        res.json({ totalIncome, totalExpense, netBalance });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
};

export const getCategoryTotals = async (req: AuthRequest, res: Response) => {
    try {
        const records = await prisma.record.findMany();
        const categories: Record<string, number> = {};

        records.forEach(r => {
            categories[r.category] = (categories[r.category] || 0) + (r.type === 'Income' ? r.amount : -r.amount);
        });

        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch category totals' });
    }
};

export const getRecentActivity = async (req: AuthRequest, res: Response) => {
    try {
        const recent = await prisma.record.findMany({
            take: 5,
            orderBy: { date: 'desc' },
            include: { user: { select: { email: true } } }
        });
        res.json(recent);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch recent activity' });
    }
};
