import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { getDB } from '../database/database.js';

const router = express.Router();

router.post("/register", async (req, res) => {
    const { login, password } = req.body;
    const db = await getDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const result = await db.query(
            'INSERT INTO users (login, password) VALUES ($1, $2) RETURNING id, login, created_at',
            [login, hashedPassword]
        );
        const newUser = result.rows[0];
        
        fetch(`${process.env.PROFILE_SERVICE_URL}/api/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: newUser.id, full_name: login })
        }).catch(console.error);
        
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ success: false, error: "Login already exists" });
    }
});

router.post("/login", async (req, res) => {
    const { login, password } = req.body;
    const db = await getDB();
    const result = await db.query('SELECT * FROM users WHERE login = $1', [login]);
    const user = result.rows[0];
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false });
    }
    
    const token = jwt.sign({ userId: user.id, login: user.login }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, user: { id: user.id, login: user.login, created_at: user.created_at } });
});

export default router;