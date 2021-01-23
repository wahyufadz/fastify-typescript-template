import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function indexController(fastify: FastifyInstance) {
  // GET /
  fastify.get("/", async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    reply.view("/page/index.ejs");
  });

  // GET /test
  fastify.get("/test", async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    reply.send({
      balance: "$3,277.32",
      picture: "http://placehold.it/32x32",
      age: 30,
      name: "Leonor Cross",
      gender: "female",
      company: "GRONK",
      email: "leonorcross@gronk.com",
    });
  });
}
