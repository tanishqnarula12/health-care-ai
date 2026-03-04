import express from 'express';
import { getReports } from '../controllers/reportController';
import { authenticateToken } from '../utils/auth';

const router = express.Router();

router.get('/', authenticateToken, getReports);

export default router;
