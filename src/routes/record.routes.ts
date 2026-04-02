import { Router } from 'express';
import { createRecord, getRecords, updateRecord, deleteRecord } from '../controllers/record.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createRecordSchema, queryRecordsSchema, updateRecordSchema } from '../schemas/record.schema';

const router = Router();

router.use(authenticate);

// Everyone can view records
router.get('/', validate(queryRecordsSchema), getRecords);

// Only Admins can create, update, delete records
router.post('/', authorizeRoles('Admin'), validate(createRecordSchema), createRecord);
router.put('/:id', authorizeRoles('Admin'), validate(updateRecordSchema), updateRecord);
router.delete('/:id', authorizeRoles('Admin'), deleteRecord);

export default router;
