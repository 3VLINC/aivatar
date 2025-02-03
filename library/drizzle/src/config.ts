const host = process.env.DATABASE_HOST;
const port = process.env.DATABASE_PORT
  ? parseInt(process.env.DATABASE_PORT)
  : undefined;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_DATABASE;
const schema = process.env.DATABASE_SCHEMA;
const ssl = process.env.DATABASE_SSL === 'true';

export const config = {
  host,
  port,
  username,
  password,
  database,
  schema,
  ssl,
};
