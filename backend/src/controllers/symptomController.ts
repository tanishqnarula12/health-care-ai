import { Response } from 'express';
import { AuthRequest } from '../utils/auth';
import { pool } from '../db';
import axios from 'axios';

export const analyzeSymptoms = async (req: AuthRequest, res: Response) => {
    try {
        const { symptoms } = req.body;
        const userId = req.user.id;

        // Send to AI Service
        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/predict-disease`, { symptoms });

        const { possible_conditions, risk_score, severity } = aiResponse.data;

        const result = await pool.query(
            'INSERT INTO Symptoms (user_id, symptoms, predicted_conditions, risk_score, severity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, [symptoms], JSON.stringify(possible_conditions), risk_score, severity]
        );

        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getSymptomHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const result = await pool.query('SELECT * FROM Symptoms WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
