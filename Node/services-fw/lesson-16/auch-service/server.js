import express from "express";
import 'dotenv/config';
import pageRouter from "./routers/pages.js";
import apiRouter from "./routers/api.js";
import { initDatabase } from './database/database.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.AUTH_PORT || 3000;

await initDatabase();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", apiRouter);
app.use("/", pageRouter);

app.listen(port, () => console.log(`Auth: http://localhost:${port}`));