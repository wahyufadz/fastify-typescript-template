import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function indexController(fastify: FastifyInstance) {
  // GET /
  fastify.get("/", async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    reply.view("/page/index.ejs");
  });
}
