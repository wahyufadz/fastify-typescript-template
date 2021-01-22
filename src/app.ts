import dotenv from "dotenv";
import ejs from "ejs";
import fastify from "fastify";
import fastifyCORS from "fastify-cors";
import fastifyFormBody from "fastify-formbody";
import fastifyOAS from "fastify-oas";
import fastifySensible from "fastify-sensible";
import fastifyTypeOrm from "fastify-typeorm-plugin";
import path from "path";
import fastifyPointOfView from "point-of-view";

import { ormconfig } from "./ormconfig";
import router from "./router";

dotenv.config();

const server = fastify({
  // Logger only for production
  logger: !!(process.env.NODE_ENV !== "development"),
});

/**
 * Plugin: fastify-cors
 * ? enables the use of CORS in a Fastify application.
 */
server.register(fastifyCORS, {});

/**
 * Plugin: fastify-typeorm-plugin
 * ? plugin for TypeORM for sharing the same TypeORM connection
 * ? in every part of your server.
 */
server.register(fastifyTypeOrm, { ...ormconfig });

/**
 * Plugin: fastify-formbody
 * ? plugin for Fastify that adds a content type parser
 * ? for the content type application/x-www-form-urlencoded.
 */

server.register(fastifyFormBody);

/**
 * Plugin: fastify-sensible
 * ? standard fastify function to handle many thing
 */
server.register(fastifySensible);

/**
 * Plugin: fastify-oas
 * ? documentation generator for Fastify.
 * ? It uses the schemas you declare in your routes to generate an OpenAPI (swagger) compliant doc.
 */
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

/**
 * Plugin: point-of-view
 * ? decorates the reply interface with the view method
 * ? for manage view engines that can be used to render templates responses.
 */
server.register(fastifyPointOfView, {
  engine: {
    ejs,
  },
  root: path.join(__dirname, "view"),
});

// Middleware: Router
server.register(router);

export default server;
