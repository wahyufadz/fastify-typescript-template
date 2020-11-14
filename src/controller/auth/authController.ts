import { compare, hash } from "bcrypt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import jwt, { decode } from 'jsonwebtoken';
import { RevokeTokenService, UserService } from '../../service';
import { login } from './authSchema';

export default async function userController(fastify: FastifyInstance) {
  const userService = new UserService()
  const revokeTokenService = new RevokeTokenService()

  const createToken = (user: any) => {
    delete user.password
    const token = jwt.sign({ user }, process.env.FASTIFY_JWT_TOKEN_SECRET || 'token secret string', { expiresIn: '2h' })
    const refreshToken = jwt.sign({ user }, process.env.FASTIFY_JWT_REFRESH_SECRET || 'refresh token secret string', { expiresIn: '10d' })
    return { token, refreshToken, user }
  }

  // POST /api/v1/auth/login
  fastify.post("/login", { schema: login }, async function (
    request: FastifyRequest<{ Body: { identity: string, password: string } }>,
    reply: FastifyReply,
  ) {
    const { identity, password } = request.body

    let user: any = await userService.readOne({ where: [{ email: identity }, { username: identity }] })

    // check is user registered
    const isUserNotRegistered = user === undefined
    if (isUserNotRegistered) {
      reply.unauthorized('user not registered')
      return
    }

    // check password
    const isPasswordNotMatch = !(await compare(password, user.password))
    // if user found then compare password with bcrypt.compare
    if (isPasswordNotMatch) {
      reply.unauthorized('username/email & password doesn\'t match')
      return
    }
    reply.send({
      statusCode: 200,
      message: 'login success',
      value: createToken(user)
    })
  });

  // POST /api/v1/auth/register
  fastify.post("/register", async function (
    request: FastifyRequest<{ Body: { username: string, email: string, firstName: string, lastName: string, password: string } }>,
    reply: FastifyReply
  ) {
    const { username, email, firstName, lastName } = request.body
    let { password } = request.body

    // check required fields
    if (!(username && email && firstName && lastName)) {
      reply.unprocessableEntity('username, email, firstName, lastName fields is required')
      return
    }

    // save data user to database
    password = await hash(password, 10)
    const user = await userService.create({ username, email, firstName, lastName, password });
    reply.send({
      statusCode: 201,
      message: 'user created',
      value: createToken(user)
    })
  });

  // POST /api/v1/auth/refresh
  fastify.post("/refresh", async function (
    request: FastifyRequest<{ Body: { refreshToken: string } }>,
    reply: FastifyReply
  ) {
    const { refreshToken } = request.body

    // check required fields
    if (!refreshToken) {
      reply.unprocessableEntity('refreshToken field is required')
      return
    }

    const decoded: any = decode(refreshToken)

    // check if token was expired
    const isTokenExpired = Number(decoded.exp) < Math.floor(Date.now() / 1000)
    if (isTokenExpired) {
      reply.unauthorized('refresh token was expired please re-login')
      return
    }

    // check refresh token is revoked / logged out
    const isLoggedOut = await revokeTokenService.readOne({ token: refreshToken }) === undefined
    if (isLoggedOut) {
      reply.unauthorized('refresh token was revoked please re-login')
      return
    }

    reply.send({
      statusCode: 200,
      message: 'token refresh success',
      value: createToken(decoded.user)
    })
  })

  // POST /api/v1/auth/logout
  fastify.post("/logout", async function (
    request: FastifyRequest<{ Body: { refreshToken: string } }>,
    reply: FastifyReply
  ) {
    const { refreshToken } = request.body

    // check required fields
    if (!revokeTokenService) {
      reply.unprocessableEntity('refreshToken & token fields is required')
      return
    }

    // check refresh token is revoked / logged out
    const isRevoked = await revokeTokenService.readOne({ token: refreshToken }) !== undefined
    if (isRevoked) {
      reply.unauthorized('refresh token was revoked')
      return
    }

    // save refresh token as revoked
    await revokeTokenService.create({ token: refreshToken })
    reply.send({
      statusCode: 200,
      message: 'user was logged out',
    })

  })

  // POST /api/v1/identity
  fastify.post("/identity", async function (
    request: FastifyRequest<{ Body: { username: string, email: string } }>,
    reply: FastifyReply
  ) {
    const { username, email } = request.body

    // check required fields
    if (!(username || email)) {
      reply.unprocessableEntity('username or email fields is required')
      return
    }

    // check if identity was taken
    const isTaken = await userService.readOne({ where: [{ username }, { email }] }) !== undefined
    if (isTaken) {
      reply.forbidden('username or email was taken')
      return
    }

    reply.send({
      statusCode: 200,
      message: 'username or email can be use'
    })

  })

}
