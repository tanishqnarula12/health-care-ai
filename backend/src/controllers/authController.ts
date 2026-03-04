import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userResult = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        if (userResult.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO Users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        const token = jwt.sign(
            { id: newUser.rows[0].id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.json({ token, user: newUser.rows[0] });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userResult = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
