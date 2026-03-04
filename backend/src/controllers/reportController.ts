import { Response } from 'express';
import { AuthRequest } from '../utils/auth';
import { pool } from '../db';

export const getReports = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT * FROM Predictions WHERE user_id = $1 ORDER BY id DESC',
            [userId]
        );

        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
