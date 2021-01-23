import { compare, hash } from "bcrypt";
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import jwt, { decode } from "jsonwebtoken";
import { RevokeToken, User } from "../../entity";
import { getManager } from "typeorm";
import {
  identity as identitySchema,
  login,
  logout,
  refresh,
  register,
} from "./authSchema";

export default async function userController(fastify: FastifyInstance) {
  // POST /api/v1/auth/login
  fastify.post<{ Body: { identity: string; password: string } }>("/login", {
    schema: login,
    preHandler: checkRequiredParams(["identity", "password"]),
    handler: async function (request, reply) {
      const { identity, password } = request.body;

      let user: any = await getManager().findOne(User, {
        where: [{ email: identity }, { username: identity }],
      });

      // check is user registered
      const isUserNotRegistered = user === undefined;
      if (isUserNotRegistered) {
        reply.unauthorized("user not registered");
        return;
      }

      // check password
      const isPasswordNotMatch = !(await compare(password, user.password));
      // if user found then compare password with bcrypt.compare
      if (isPasswordNotMatch) {
        reply.unauthorized("username/email & password doesn't match");
        return;
      }
      reply.send({
        statusCode: 200,
        message: "login success",
        value: createToken(user),
      });
    },
  });

  // POST /api/v1/auth/register
  fastify.post<{
    Body: {
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    };
  }>("/register", {
    schema: register,
    preHandler: checkRequiredParams([
      "username",
      "email",
      "firstName",
      "lastName",
      "password",
    ]),
    handler: async function (request, reply) {
      const { username, email, firstName, lastName } = request.body;
      let { password } = request.body;

      // save data user to database
      password = await hash(password, 10);
      const newUser = new User();
      newUser.username = username;
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = password;
      await getManager().save(newUser);

      reply.send({
        statusCode: 201,
        message: "user created",
        value: createToken(newUser),
      });
    },
  });

  // POST /api/v1/auth/refresh
  fastify.post<{ Body: { refreshToken: string } }>("/refresh", {
    schema: refresh,
    preHandler: checkRequiredParams(["refreshToken"]),
    handler: async function (request, reply) {
      const { refreshToken } = request.body;

      const decoded: any = decode(refreshToken);

      //  check if token is not valid
      if (!decoded) {
        reply.badRequest("refreshToken is not valid");
        return;
      }

      // check if token was expired
      const isTokenExpired =
        Number(decoded.exp) < Math.floor(Date.now() / 1000);
      if (isTokenExpired) {
        reply.unauthorized("refresh token was expired please re-login");
        return;
      }

      // check refresh token is revoked / logged out
      const isLoggedOut =
        (await getManager().findOne(RevokeToken, { token: refreshToken })) !==
        undefined;
      if (isLoggedOut) {
        reply.unauthorized("refresh token was revoked please re-login");
        return;
      }

      reply.send({
        statusCode: 200,
        message: "token refresh success",
        value: createToken(decoded.user),
      });
    },
  });

  // POST /api/v1/auth/logout
  fastify.post<{ Body: { refreshToken: string } }>("/logout", {
    schema: logout,
    preHandler: checkRequiredParams(["refreshToken"]),
    handler: async function (request, reply) {
      const { refreshToken } = request.body;

      const decoded: any = decode(refreshToken);

      //  check if token is not valid
      if (!decoded) {
        reply.badRequest("refreshToken is not valid");
        return;
      }

      // check if token was expired
      const isTokenExpired =
        Number(decoded.exp) < Math.floor(Date.now() / 1000);
      if (isTokenExpired) {
        reply.unauthorized("refresh token was expired please re-login");
        return;
      }

      // check refresh token is revoked / logged out
      const isLoggedOut =
        (await getManager().findOne(RevokeToken, { token: refreshToken })) !==
        undefined;
      if (isLoggedOut) {
        reply.unauthorized("refresh token was revoked please re-login");
        return;
      }

      // save refresh token as revoked
      const revokedToken = new RevokeToken();
      revokedToken.token = refreshToken;
      await getManager().save(revokedToken);
      reply.send({
        statusCode: 200,
        message: "user was logged out",
      });
    },
  });

  // POST /api/v1/identity
  fastify.post<{ Body: { identity: string } }>("/identity", {
    schema: identitySchema,
    preHandler: checkRequiredParams(["identity"]),
    handler: async function (request, reply) {
      const { identity } = request.body;

      // check if identity was taken
      const isTaken =
        (await getManager().findOne(User, {
          where: [{ username: identity }, { email: identity }],
        })) !== undefined;
      if (isTaken) {
        reply.forbidden("username or email was taken");
        return;
      }

      reply.send({
        statusCode: 200,
        message: "username or email not registered yet",
      });
    },
  });
}

const createToken = (user: any) => {
  delete user.password;
  const token = jwt.sign(
    { user },
    process.env.FASTIFY_JWT_TOKEN_SECRET || "token secret string",
    { expiresIn: "2h" }
  );
  const refreshToken = jwt.sign(
    { user },
    process.env.FASTIFY_JWT_REFRESH_SECRET || "refresh token secret string",
    { expiresIn: "10d" }
  );
  return { token, refreshToken, user };
};

const checkRequiredParams = <T>(params: string[]) => (
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
