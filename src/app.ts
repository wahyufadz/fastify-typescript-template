import dotenv from 'dotenv';
import fastify from "fastify";
import fastifyCORS from "fastify-cors";
import fastifyFormBody from "fastify-formbody";
import fastifySensible from 'fastify-sensible';
import fastifyTypeOrm from 'fastify-typeorm-plugin';
import ormConfig from '../ormconfig.json';
import router from "./router";

dotenv.config();

const server = fastify({
  // Logger only for production
  logger: !!(process.env.NODE_ENV !== "development"),
})

server.register(fastifyCORS, {})

// Plugin: fastify-typeorm-plugin
server.register(fastifyTypeOrm, ormConfig)

// Plugin: fastify-formbody
server.register(fastifyFormBody)

// Plugin: fastify-sensible
server.register(fastifySensible)

// Middleware: Router
server.register(router);

export default server;
