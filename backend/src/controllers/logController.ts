import { Response } from 'express';
import { AuthRequest } from '../utils/auth';
import { pool } from '../db';

export const createLog = async (req: AuthRequest, res: Response) => {
    try {
        const { symptoms, notes } = req.body;
        const userId = req.user.id;

        const result = await pool.query(
            'INSERT INTO HealthLogs (user_id, symptoms, notes) VALUES ($1, $2, $3) RETURNING *',
            [userId, symptoms, notes]
        );

        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getLogs = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const result = await pool.query('SELECT * FROM HealthLogs WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
