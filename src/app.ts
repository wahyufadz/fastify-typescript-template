import dotenv from 'dotenv';
import fastify from "fastify";
import fastifyFormBody from "fastify-formbody";
import fastifyTypeOrm from 'fastify-typeorm-plugin';
import router from "./router";

dotenv.config();

const server = fastify({
  // Logger only for production
  logger: !!(process.env.NODE_ENV !== "development"),
});
// Plugin: fastify-typeorm-plugin
server.register(fastifyTypeOrm, {
  type: process.env.TYPEORM_TYPE,
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  port: process.env.TYPEORM_PORT,
  database: process.env.TYPEORM_DATABASE,
  entities: ["entity/*.js"],
})

// Plugin: fastify-formbody
server.register(fastifyFormBody)

// Middleware: Router
server.register(router);

export default server;
