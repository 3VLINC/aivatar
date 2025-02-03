import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import { config } from './config';

const { Pool } = pkg;

const { database, host, password, port, username: user, ssl } = config;

const pool = new Pool({
  host,
  database,
  password,
  port,
  user,
  ssl,
});

export const db = drizzle(pool);
