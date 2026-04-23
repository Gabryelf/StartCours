import Fastify from 'fastify';
import routes from './routes.js';

const fastify = Fastify({ logger: false });

fastify.register(routes);

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('Сервер на http://localhost:3000');
});