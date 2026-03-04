import { Response } from 'express';
import { AuthRequest } from '../utils/auth';
import { pool } from '../db';
import axios from 'axios';

export const chatWithAI = async (req: AuthRequest, res: Response) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/ai-chat`, { message });
        const responseText = aiResponse.data.response;

        const result = await pool.query(
            'INSERT INTO ChatHistory (user_id, message, response) VALUES ($1, $2, $3) RETURNING *',
            [userId, message, responseText]
        );

        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
