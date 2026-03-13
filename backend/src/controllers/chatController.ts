import { Response } from 'express';
import { AuthRequest } from '../utils/auth';
import { pool } from '../db';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

export const chatWithAI = async (req: AuthRequest, res: Response) => {
    try {
        const { message, recentVitals } = req.body;
        const userId = req.user.id;

        if (!process.env.GEMINIAI_API_KEY) {
            console.error("Missing Gemini API Key in backend env!");
            return res.status(500).json({ error: "Gemini API Key missing from backend" });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINIAI_API_KEY as string });

        // Retrieve the last 3 messages to give Gemini context
        const historyResult = await pool.query(
            'SELECT role, content FROM chat_messages WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3',
            [userId]
        );
        const recentHistory = historyResult.rows.reverse();

        // Set up the AI's persona and instructions using the dedicated systemInstruction feature
        const systemInstruction = `You are Aura, an empathetic, highly intelligent, and professional medical AI doctor for Lumina Health.
Your role is to understand the patient's concerns, answer their medical questions accurately, and provide sensible advice.
IMPORTANT RULES:
1. Speak conversationally and compassionately, like a real doctor talking to a patient.
2. DO NOT just recite their health data back to them. Only mention their vitals if it directly relates to the symptoms they are describing.
3. If they ask a question or describe an issue, actually diagnose the possibilities and give guidance. Be helpful!
4. Do not act like a robotic AI. Act human and professional.
5. Keep your responses organized, readable, and under 3 short paragraphs.
6. (Disclaimer) You are an AI, remind them to consult a real physician for emergencies if appropriate, but still answer their question.

Patient's Current Vitals (For your reference only):
- Blood Pressure: ${recentVitals?.bloodPressureSys || 'Unknown'} / ${recentVitals?.bloodPressureDia || 'Unknown'}
- Resting Heart Rate: ${recentVitals?.restingHeartRate || 'Unknown'}
- Blood Oxygen: ${recentVitals?.bloodOxygen || 'Unknown'}%`;

        const historyText = recentHistory.length > 0
            ? `Previous Conversation History:\n${recentHistory.map((h: any) => `${h.role === 'user' ? 'Patient' : 'Aura'}: ${h.content}`).join('\n')}\n\n`
            : "";

        const finalPrompt = `${historyText}Patient says: "${message}"\n\nPlease respond directly to the patient:`;

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: finalPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            }
        });
        const botResponseText = result.text ?? "I'm sorry, I could not generate a response right now.";

        // Save User Message
        await pool.query(
            "INSERT INTO chat_messages (user_id, role, content) VALUES ($1, 'user', $2)",
            [userId, message]
        );

        // Save Bot Response
        await pool.query(
            "INSERT INTO chat_messages (user_id, role, content) VALUES ($1, 'assistant', $2)",
            [userId, botResponseText]
        );

        res.json({ response: botResponseText });
    } catch (err: any) {
        console.error("Gemini Chat API Error:", err);
        res.status(500).json({ error: err.message });
    }
};
