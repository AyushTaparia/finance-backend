import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { getSummary, getCategoryTotals, getRecentActivity } from '../controllers/dashboard.controller';

const router = Router();

router.use(authenticate);

// Admins and Analysts have access to overall dashboard metrics
router.get('/summary', authorizeRoles('Admin', 'Analyst'), getSummary);
router.get('/category-totals', authorizeRoles('Admin', 'Analyst'), getCategoryTotals);

// Recent activity can be viewed by all authenticated users
router.get('/recent', getRecentActivity);

export default router;
