import { Request, Response } from 'express';
import prisma from '../db';
import { z } from 'zod';

export const updateRoleSchema = z.object({
    body: z.object({
        role: z.enum(['Admin', 'Analyst', 'Viewer']),
    }),
});

export const updateStatusSchema = z.object({
    body: z.object({
        status: z.enum(['Active', 'Inactive']),
    }),
});

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, role: true, status: true, createdAt: true },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { role } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, email: true, role: true, status: true },
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Could not update user role' });
    }
};

export const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { status } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { status },
            select: { id: true, email: true, role: true, status: true },
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Could not update user status' });
    }
};
