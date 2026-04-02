import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'Viewer';

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: userRole,
            },
        });

        const token = generateToken({ id: user.id, role: user.role });

        res.status(201).json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.status !== 'Active') {
            return res.status(401).json({ error: 'Invalid credentials or inactive user' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({ id: user.id, role: user.role });
        res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
