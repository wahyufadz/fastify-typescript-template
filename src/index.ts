import app from "./app";

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3006;

app.listen(FASTIFY_PORT, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`🚀  Fastify server running on port ${FASTIFY_PORT}`);
  }
});

