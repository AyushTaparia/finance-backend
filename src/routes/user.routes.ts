import { Router } from 'express';
import { getUsers, updateUserRole, updateUserStatus, updateRoleSchema, updateStatusSchema } from '../controllers/user.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// Only Admins can manage users
router.use(authenticate, authorizeRoles('Admin'));

router.get('/', getUsers);
router.put('/:id/role', validate(updateRoleSchema), updateUserRole);
router.put('/:id/status', validate(updateStatusSchema), updateUserStatus);

export default router;
