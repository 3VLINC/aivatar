import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate as doMigration } from 'drizzle-orm/node-postgres/migrator';
import { config } from './config';

const { Pool } = pg;
const { host, password, database, port, username: user, ssl } = config;

const client = new Pool({
  host,
  password,
  database,
  port,
  user,
  ssl,
  max: 1,
});

const migrationsFolder = './generated';

export const migrate = () =>
  doMigration(drizzle(client), {
    migrationsFolder,
  });
