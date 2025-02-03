import { defineConfig } from 'drizzle-kit';
import { config } from './config';

const { host, password, database, port, username: user, ssl } = config;

export default defineConfig({
  schema: './schema.ts',
  out: './generated',
  dialect: 'postgresql',
  dbCredentials: {
    host,
    user,
    password,
    database,
    port,
    ssl,
  },
});
