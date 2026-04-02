import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../db';

export const createRecord = async (req: AuthRequest, res: Response) => {
    try {
        const { amount, type, category, date, notes } = req.body;
        const userId = req.user!.id;

        const record = await prisma.record.create({
            data: {
                amount,
                type,
                category,
                date: date ? new Date(date) : new Date(),
                notes,
                userId,
            },
        });

        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create record' });
    }
};

export const getRecords = async (req: AuthRequest, res: Response) => {
    try {
        const { type, category, dateFrom, dateTo, page = '1', limit = '10' } = req.query;
        const userId = req.user!.id;
        const userRole = req.user!.role;

        // Viewers and Analysts can see all records, or we can restrict to self.
        // Assuming Dashboard is company-wide, they see all records.
        // If we want users to see only their own, we filter by userId (for Viewer maybe?).
        // Assignment says: "Analyst: Can view records, Admin: Can create/update, Viewer: Can only view". We'll allow seeing all.

        const where: any = {};
        if (type) where.type = type as string;
        if (category) where.category = category as string;
        if (dateFrom || dateTo) {
            where.date = {};
            if (dateFrom) where.date.gte = new Date(dateFrom as string);
            if (dateTo) where.date.lte = new Date(dateTo as string);
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const records = await prisma.record.findMany({
            where,
            skip,
            take: parseInt(limit as string),
            orderBy: { date: 'desc' },
            include: { user: { select: { email: true } } },
        });

        const total = await prisma.record.count({ where });

        res.json({
            data: records,
            meta: {
                total,
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                totalPages: Math.ceil(total / parseInt(limit as string)),
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve records' });
    }
};

export const updateRecord = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const data = req.body;

        if (data.date) {
            data.date = new Date(data.date);
        }

        const record = await prisma.record.update({
            where: { id },
            data,
        });

        res.json(record);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update record' });
    }
};

export const deleteRecord = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.record.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete record' });
    }
};
