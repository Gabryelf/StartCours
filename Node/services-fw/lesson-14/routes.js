import api from './api.js';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async (fastify) => {
  fastify.get('/', (req, reply) => {
    reply.sendFile('index.html');
  });
  
  fastify.post('/check', async (req, reply) => {
    const result = api.checkPalindrome(req.body.text);
    reply.send({ success: result });
  });
  
  fastify.register(fastifyStatic, {
    root: __dirname,
  });
};