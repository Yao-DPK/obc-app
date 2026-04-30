import { pgTable, serial, varchar, timestamp, text, integer, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).$type<'parent' | 'player' | 'admin'>().default('parent').notNull(),
  notificationPreferences: jsonb('notification_preferences').$type<{
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  }>().default({ email: true, sms: false, push: true }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});