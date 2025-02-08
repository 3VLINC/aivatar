import { bigint, pgSchema, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const app = pgSchema('app');

export const webhooks = app.table('Webhook', {
  id: varchar('id').primaryKey(),
  type: varchar('type').$type<'cast.created'>(),
})

export const webhookSecrets = app.table('WebhookSecret', {
  uid: varchar('uid').primaryKey(),
  webhookId: varchar('webhook_id'),
  value: varchar('value'),
  expiresAt: varchar('expires_at'),
  createdAt: varchar('created_at'),
  updatedAt: varchar('updated_at'),
  deletedAt: varchar('deleted_at'),
});

export const webhookWebhookSecrets = relations(webhooks, ({ many }) => ({
  secrets: many(webhookSecrets),
}));

export const webhookSecretWebhook = relations(webhookSecrets, ({ one }) => ({
  webhook: one(webhooks, {
    fields: [webhookSecrets.webhookId],
    references: [webhooks.id],
  }),
}));

export const users = app.table('User', {
  fid: bigint('fid', { mode: 'bigint' }).primaryKey(),
  signerUuid: varchar('signer_uuid'),
});

export const casts = app.table('Cast', {
  hash: varchar('hash').primaryKey(),
  fid: bigint('fid', { mode: 'bigint' }),
  text: varchar('text'),
  created_at: timestamp('created_at'),
});

export const tokens = app.table('Tokens', {
  tokenId: bigint('tokenId', { mode: 'bigint' }).primaryKey(),
  address: varchar('address'),
  expression: integer('expression'),
});

export const castUser = relations(casts, ({ one }) => ({
  user: one(users, {
    fields: [casts.fid],
    references: [users.fid],

  }),
}));

export const usersCasts = relations(users, ({ many }) => ({
  casts: many(casts),
}));

