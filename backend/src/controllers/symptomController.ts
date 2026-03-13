import { Response } from 'express';
import { AuthRequest } from '../utils/auth';
import { pool } from '../db';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

export const analyzeSymptoms = async (req: AuthRequest, res: Response) => {
    try {
        const { symptoms, bloodOxygen, restingHeartRate, sleepHours, activityScore } = req.body;
        const userId = req.user.id;

        // Ensure we have a valid key
        if (!process.env.GEMINIAI_API_KEY) {
            console.error("Missing Gemini API Key in backend env!");
            return res.status(500).json({ error: "Gemini API Key missing from backend" });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINIAI_API_KEY as string });

        // Construct a highly detailed prompt for the triage AI
        const prompt = `You are Lumina Health, a world-class AI medical triage assistant. 
        Analyze the following real-time patient data and recent symptoms. 
        
        Vitals:
        - Blood Oxygen: ${bloodOxygen || 'Not provided'}%
        - Resting Heart Rate: ${restingHeartRate || 'Not provided'} BPM
        - Sleep Duration: ${sleepHours || 'Not provided'} hours
        - Activity Score: ${activityScore || 'Not provided'}/100
        
        Patient Symptoms: 
        "${symptoms}"

        You MUST respond ONLY with a valid JSON object in this exact format (do not include markdown tags like \`\`\`json):
        {
            "risk_score": <number between 1-100 indicating health risk>,
            "severity": "<string, e.g., 'Low Severity', 'Medium', 'High - Immediate Care Needed'>",
            "possible_conditions": [
                {"condition": "<string>", "probability": <number between 0-1>}
            ],
            "ai_analysis_notes": "<string, a short compassionate 2-3 sentence paragraph explaining the risk score and offering recovery advice>"
        }`;

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const responseText = result.text ?? '';

        // Clean markdown formatting if Gemini returns it
        const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiAnalysis = JSON.parse(cleanJsonStr);

        // Store this assessment in the database
        const dbResult = await pool.query(
            'INSERT INTO symptom_assessments (user_id, symptoms_description, ai_analysis_notes, risk_score) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, symptoms, aiAnalysis.ai_analysis_notes, aiAnalysis.risk_score]
        );

        res.json({
            ...aiAnalysis,
            db_record_id: dbResult.rows[0].id
        });
    } catch (err: any) {
        console.error("Gemini AI API Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getSymptomHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const result = await pool.query('SELECT * FROM symptom_assessments WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
