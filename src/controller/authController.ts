import { compareSync, hashSync } from "bcrypt";
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
    const { identity, password } = request.body
    const email = identity;
    const username = identity;
    let user: any = await userRepo.readOne({ where: [{ email }, { username }] })

    // if user found then compare password with bcrypt.compareSync
    if (user && compareSync(password, user.password)) {
      reply.send({
        statusCode: 200,
        message: 'login success',
        value: createToken(user)
      })
    } else {
      reply.unauthorized('username/email & password doesn\'t match')
    }
  });

  // POST /api/v1/auth/register
  fastify.post("/register", async function (
    request: FastifyRequest<{ Body: { username: string, email: string, firstName: string, lastName: string, password: string } }>,
    reply: FastifyReply
  ) {
    const { username, email, firstName, lastName } = request.body
    let { password } = request.body
    password = hashSync(password, 10)
    const user = await userRepo.create({ username, email, firstName, lastName, password });
    reply.send({
      statusCode: 201,
      message: 'user created',
      value: createToken(user)
    })
  });

  // // POST /api/v1/auth/refresh-token
  // // POST /api/v1/auth/logout

  const createToken = (user: any) => {
    delete user.password
    const token = jwt.sign({ user }, process.env.FASTIFY_JWT_TOKEN_SECRET || 'token secret string', { expiresIn: '2h' })
    const refreshToken = jwt.sign({}, process.env.FASTIFY_JWT_REFRESH_SECRET || 'refresh token secret string', { expiresIn: '10d' })
    return { token, refreshToken, user }
  }
}
