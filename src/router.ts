import { FastifyInstance } from "fastify";
import authController from "./controller/authController";
import indexController from "./controller/indexController";
import userController from "./controller/userController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(indexController);
  fastify.register(authController, { prefix: "/api/v1/auth" });
  fastify.register(userController, { prefix: "/api/v1/user" });
}
