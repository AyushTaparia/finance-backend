import { z } from 'zod';

export const createRecordSchema = z.object({
    body: z.object({
        amount: z.number().positive(),
        type: z.enum(['Income', 'Expense']),
        category: z.string().min(1),
        date: z.string().datetime().optional(), // ISO string, defaults to now if not provided
        notes: z.string().optional(),
    }),
});

export const updateRecordSchema = z.object({
    body: z.object({
        amount: z.number().positive().optional(),
        type: z.enum(['Income', 'Expense']).optional(),
        category: z.string().min(1).optional(),
        date: z.string().datetime().optional(),
        notes: z.string().optional(),
    }),
});

export const queryRecordsSchema = z.object({
    query: z.object({
        type: z.enum(['Income', 'Expense']).optional(),
        category: z.string().optional(),
        dateFrom: z.string().datetime().optional(),
        dateTo: z.string().datetime().optional(),
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
    }),
});
