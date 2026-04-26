import jwt from 'jsonwebtoken';

export async function verifyJWT(request, reply) {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({ success: false });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
    } catch (err) {
        return reply.status(401).send({ success: false });
    }
}