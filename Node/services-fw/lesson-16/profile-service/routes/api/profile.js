import { getDB } from '../../database/database.js';

export default async function profileRoutes(fastify) {
    fastify.get('/api/profile', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const result = await getDB().query('SELECT * FROM profiles WHERE user_id = $1', [request.user.userId]);
        if (result.rows.length === 0) return reply.status(404).send({ success: false });
        return { success: true, profile: result.rows[0] };
    });

    fastify.post('/api/profile', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const { full_name, bio, birth_date } = request.body;
        const result = await getDB().query(
            `INSERT INTO profiles (user_id, full_name, bio, birth_date)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id) DO UPDATE SET
                full_name = EXCLUDED.full_name,
                bio = EXCLUDED.bio,
                birth_date = EXCLUDED.birth_date,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [request.user.userId, full_name, bio, birth_date]
        );
        return { success: true, profile: result.rows[0] };
    });

    fastify.delete('/api/profile', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const result = await getDB().query('DELETE FROM profiles WHERE user_id = $1 RETURNING *', [request.user.userId]);
        if (result.rows.length === 0) return reply.status(404).send({ success: false });
        return { success: true };
    });
}