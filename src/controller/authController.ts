import { compareSync } from "bcrypt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import jwt from 'jsonwebtoken';
import { userService } from '../service';

export default async function userController(fastify: FastifyInstance) {
  const userRepo = new userService()

  // POST /api/v1/auth/login
  fastify.post("/login", async function (
    request: FastifyRequest<{ Body: { identity: string, password: string } }>,
    reply: FastifyReply
  ) {
    let { identity, password } = request.body
    let user: any = await userRepo.readOne({ identity })

    // if user found then compare password with bcrypt.compareSync
    if (user && compareSync(password, user.password)) {
      const token = jwt.sign({ user }, process.env.FASTIFY_JWT_TOKEN_SECRET || 'token secret string', { expiresIn: '2h' })
      const refreshToken = jwt.sign({ identity }, process.env.FASTIFY_JWT_REFRESH_SECRET || 'refresh token secret string', { expiresIn: '10d' })
      delete user.password
      reply.send({
        statusCode: 200,
        message: 'login success',
        value: {
          token,
          refreshToken,
          user
        }
      })
    } else {
      reply.unauthorized('username/email & password doesn\'t match')
    }
  });

  // // POST /api/v1/auth/register
  // // POST /api/v1/auth/refresh-token
  // // POST /api/v1/auth/logout
}
