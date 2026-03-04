import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import symptomRoutes from './routes/symptoms';
import logRoutes from './routes/logs';
import chatRoutes from './routes/chat';
import reportRoutes from './routes/reports';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/risk-score', (req, res) => {
    // Placeholder for overall risk score
    res.json({ score: 85, severity: 'Low Severity', message: 'Stable' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
