import { FastifyInstance } from "fastify";
import authController from "./controller/auth/authController";
import indexController from "./controller/index/indexController";
import userController from "./controller/user/userController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(indexController);
  fastify.register(authController, { prefix: "/api/v1/auth" });
  fastify.register(userController, { prefix: "/api/v1/user" });
}
