import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Получаем правильный путь к текущему файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ищем .env файл
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('✅ .env loaded from:', envPath);
} else {
    console.error('❌ .env not found at:', envPath);
    process.exit(1);
}

const fastify = Fastify({
    logger: true
});

const initializeApp = async () => {
    // Проверяем, что DATABASE_URL существует
    let databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
        console.error('❌ DATABASE_URL is not defined in .env');
        console.error('Available env vars:', Object.keys(process.env));
        throw new Error('DATABASE_URL is not defined in .env');
    }
    
    // Добавляем sslmode если его нет
    if (!databaseUrl.includes('sslmode')) {
        databaseUrl = databaseUrl + (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=require';
        console.log('✅ Added sslmode=require to connection string');
    }
    
    console.log('📡 Connecting to database...');
    console.log('📡 Host:', databaseUrl.split('@')[1]?.split('/')[0]);
    
    await fastify.register(fastifyPostgres, {
        connectionString: databaseUrl,
        ssl: {
            rejectUnauthorized: false
        }
    });

    // Инициализируем таблицу
    const client = await fastify.pg.connect();
    await client.query(`
        CREATE TABLE IF NOT EXISTS profiles (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE NOT NULL,
            full_name VARCHAR(100),
            bio TEXT,
            birth_date DATE,
            avatar_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    client.release();
    fastify.log.info('✅ Database tables ready');
};

// Health check
fastify.get('/health', async (request, reply) => {
    try {
        const client = await fastify.pg.connect();
        const { rows } = await client.query('SELECT NOW() as time');
        client.release();
        
        return {
            status: 'ok',
            database: 'connected',
            serverTime: rows[0].time,
            service: 'profile-service'
        };
    } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
            status: 'error',
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// Создание профиля
fastify.post('/api/profiles', async (request, reply) => {
    const { user_id, full_name, bio } = request.body;
    
    if (!user_id) {
        return reply.status(400).send({
            success: false,
            error: 'user_id is required'
        });
    }
    
    try {
        const client = await fastify.pg.connect();
        const { rows } = await client.query(
            `INSERT INTO profiles (user_id, full_name, bio)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id) DO UPDATE 
             SET full_name = EXCLUDED.full_name, bio = EXCLUDED.bio
             RETURNING *`,
            [user_id, full_name, bio]
        );
        client.release();
        
        return {
            success: true,
            profile: rows[0]
        };
    } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
            success: false,
            error: 'Database error: ' + error.message
        });
    }
});

// Получение профиля
fastify.get('/api/profiles/:user_id', async (request, reply) => {
    const { user_id } = request.params;
    
    try {
        const client = await fastify.pg.connect();
        const { rows } = await client.query(
            'SELECT * FROM profiles WHERE user_id = $1',
            [user_id]
        );
        client.release();
        
        if (rows.length === 0) {
            return reply.status(404).send({
                success: false,
                error: 'Profile not found'
            });
        }
        
        return {
            success: true,
            profile: rows[0]
        };
    } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
            success: false,
            error: 'Database error: ' + error.message
        });
    }
});

// Запуск
const start = async () => {
    try {
        await initializeApp();
        const port = process.env.PROFILE_PORT || 3001;
        await fastify.listen({ port: port, host: '0.0.0.0' });
        fastify.log.info(`🚀 Profile service running on http://localhost:${port}`);
        fastify.log.info(`📋 Health check: http://localhost:${port}/health`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();