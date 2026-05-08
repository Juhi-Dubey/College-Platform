import { Router } from 'express';
import { authenticate  } from '../middlewares/auth.middleware';
import {
  saveComparison,
  getSavedComparisons,
  removeComparison,
} from '../controllers/comparison.controller';

const router = Router();

router.post('/', authenticate, saveComparison);
router.get('/', authenticate, getSavedComparisons);
router.delete('/:id', authenticate, removeComparison);

export default router;