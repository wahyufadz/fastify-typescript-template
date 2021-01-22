export const ormconfig = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "fastify-typescript-template",
  synchronize: true,
  logging: false,
  entities: [__dirname + "/entity/index.{js,ts}"],
  migrations: [__dirname + "/migration/**/*.{js,ts}"],
  subscribers: [__dirname + "/subscriber/**/*.{js,ts}"],
  cli: {
    entitiesDir: __dirname + "/entity",
    migrationsDir: __dirname + "/migration",
    subscribersDir: __dirname + "/subscriber",
  },
};
