import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function pageRoutes(fastify) {
    fastify.get('/profile', (request, reply) => {
        reply.sendFile('profile.html', path.join(__dirname, '../public'));
    });
}