import express from 'express';
import { chatWithAI } from '../controllers/chatController';
import { authenticateToken } from '../utils/auth';

const router = express.Router();

router.post('/', authenticateToken, chatWithAI);

export default router;
