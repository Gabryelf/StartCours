import express from "express";
import bcrypt from 'bcrypt';
import { getDb } from '../database.js';

const router = express.Router();

router.post("/register", async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ 
            success: false, 
            error: "Логин и пароль обязательны" 
        });
    }

    if (password.length < 4) {
        return res.status(400).json({ 
            success: false, 
            error: "Пароль должен быть минимум 4 символа" 
        });
    }

    const db = getDb();
        
    const hashedPassword = await bcrypt.hash(password, 10);
        
    await db.run(
            'INSERT INTO users (login, password) VALUES (?, ?)',
            [login, hashedPassword]
    );

    res.json({ 
        success: true, 
        message: "Регистрация успешна!" 
    });
});

router.post("/login", async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ 
            success: false, 
            error: "Логин и пароль обязательны" 
        });
    }

    const db = getDb();
        
        
    const user = await db.get(
        'SELECT * FROM users WHERE login = ?',
        [login]
    );
        

    if (!user) {
        return res.status(401).json({ 
            success: false, 
            error: "Неверный логин или пароль" 
        });
    }
        
    const isPasswordValid = await bcrypt.compare(password, user.password);
        
    if (!isPasswordValid) {
        return res.status(401).json({ 
            success: false, 
            error: "Неверный логин или пароль" 
        });
    }

    res.json({ 
        success: true, 
        message: "Вход выполнен успешно!",
        user: {
            id: user.id,
            login: user.login,
            created_at: user.created_at
        }
    });

    router.post("/send-message", (req, res) => {
        const {message} = req.body;
    
        const processMessage = {
            length: message.length,
            wordCount: message.trim().split(/\s+/).length
        };
    
        res.json(processMessage);
    });

});

export default router;