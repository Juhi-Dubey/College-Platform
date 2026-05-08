import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { saveCollege, getSavedColleges, removeSavedCollege } from '../controllers/saved.controller';

const router = Router();

router.post('/', authenticate, saveCollege);
router.get('/', authenticate, getSavedColleges);
router.delete('/:collegeId', authenticate, removeSavedCollege);


export default router;
