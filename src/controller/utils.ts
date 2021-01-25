import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";

export const checkRequiredParams = <T>(...params: string[]) => (
  request: FastifyRequest<T>,
  reply: FastifyReply,
  next: HookHandlerDoneFunction
) => {
  const required: string[] = [];
  params.forEach((param) => {
    if (!(param in request.body)) required.push(param);
  });
  if (required.length) {
    reply.badRequest(required.join(", ") + " is required");
    return;
  }
  next();
};
