import dotenv from "dotenv";
import fastify from "fastify";
import fastifyCORS from "fastify-cors";
import fastifyFormBody from "fastify-formbody";
import fastifyOAS from "fastify-oas";
import fastifySensible from "fastify-sensible";
import fastifyTypeOrm from "fastify-typeorm-plugin";
import ormConfig from "../ormconfig.json";
import router from "./router";
import fastifyPointOfView from "point-of-view";
import ejs from "ejs";
import path from "path";

dotenv.config();

const server = fastify({
  // Logger only for production
  logger: !!(process.env.NODE_ENV === "development"),
});

server.register(fastifyCORS, {});

// Plugin: fastify-typeorm-plugin
server.register(fastifyTypeOrm, {
  ...ormConfig,

  // fix directory structure bug in production mode
  entities: [__dirname + "/entity/index.{js,ts}"],
  migrations: [__dirname + "/migration/**/*.{js,ts}"],
  subscribers: [__dirname + "/subscriber/**/*.{js,ts}"],
});

// Plugin: fastify-formbody
server.register(fastifyFormBody);

// Plugin: fastify-sensible
server.register(fastifySensible);

// Plugin: fastify-oas
server.register(fastifyOAS, {
  routePrefix: "/documentation",
  swagger: {
    info: {
      title: "Fastify + Typescript Template",
      description: "testing the fastify swagger api",
      version: "0.1.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
    consumes: ["application/json"], // app-wide default media-type
    produces: ["application/json"], // app-wide default media-type
    servers: [
      {
        url:
          "http://" +
          process.env.FASTIFY_BASE_URL +
          ":" +
          (process.env.FASTIFY_PORT || "3000"),
        description: "Development Server",
      },
      {
        url: "http://" + process.env.FASTIFY_BASE_URL,
        description: "Main API Server",
      },
    ],
    components: {
      // see https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md#componentsObject for more options
      securitySchemes: {
        api_key: {
          type: "apiKey",
          name: "api_key",
          in: "header",
        },
      },
    },
    tags: [
      {
        name: "auth",
        description: "authentication api server",
      },
    ],
  },
  exposeRoute: true,
});

server.register(fastifyPointOfView, {
  engine: {
    ejs,
  },
  root: path.join(__dirname, "view"),
});

// Middleware: Router
server.register(router);

export default server;
