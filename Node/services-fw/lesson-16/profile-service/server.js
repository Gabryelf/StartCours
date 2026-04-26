import Fastify from 'fastify';
import 'dotenv/config';
import cors from '@fastify/cors';
import { initDatabase } from './database/database.js';
import { verifyJWT } from './middleware/auth.js';
import profileRoutes from './routes/api/profile.js';
import pageRoutes from './routes/pages.js';

const fastify = Fastify({ logger: false });

await fastify.register(cors, { origin: true });
await initDatabase();
fastify.decorate('verifyJWT', verifyJWT);
await fastify.register(profileRoutes);
await fastify.register(pageRoutes);

const port = process.env.PROFILE_PORT || 3001;
fastify.listen({ port, host: '0.0.0.0' }, () => {
    console.log(`Profile: http://localhost:${port}`);
});