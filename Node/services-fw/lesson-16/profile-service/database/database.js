import pg from "pg";
const { Pool } = pg;
let pool;

export async function initDatabase(){
    pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false}});
    await pool.query(`
        CREATE TABLE IF NOT EXISTS profiles (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE NOT NULL,
            full_name VARCHAR(100),
            bio TEXT,
            birth_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    return pool;
}

export function getDB(){ return pool; }