import express from 'express';
import { analyzeSymptoms, getSymptomHistory } from '../controllers/symptomController';
import { authenticateToken } from '../utils/auth';

const router = express.Router();

router.post('/analyze', authenticateToken, analyzeSymptoms);
router.get('/history', authenticateToken, getSymptomHistory);

export default router;
