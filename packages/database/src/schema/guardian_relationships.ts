import { pgTable, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const guardianRelationships = pgTable('guardian_relationships', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  guardianId: integer('guardian_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  playerId: integer('player_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  permissions: jsonb('permissions').$type<{
    canPay?: boolean;
    canRegister?: boolean;
  }>().default({ canPay: true, canRegister: false }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});