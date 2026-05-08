import { Router } from 'express';
import { getColleges, getCollegeById } from '../controllers/college.controller';

const router = Router();

router.get('/', getColleges);
router.get('/:id', getCollegeById);

export default router;
