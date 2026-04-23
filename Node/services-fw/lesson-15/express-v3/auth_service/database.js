import sqlite from "sqlite3";
import {open} from "sqlite";
import bcrypt from "bcrypt";

let db;

export async function initializeDatabase(){
    db = await open({
        filename: "./database.db",
        driver: sqlite.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            login TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('База данных инициализирована');
    return db;
}

export function getDb(){
    return db;
}