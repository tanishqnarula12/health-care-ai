import express from 'express';
import { createLog, getLogs } from '../controllers/logController';
import { authenticateToken } from '../utils/auth';

const router = express.Router();

router.post('/', authenticateToken, createLog);
router.get('/', authenticateToken, getLogs);

export default router;
