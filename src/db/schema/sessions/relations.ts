import { relations } from "drizzle-orm";
import { sessions } from "./table";
import { users } from "../users";

/**
 * Relations untuk sessions table
 * 
 * Domain: Authentication
 * Responsibility: Mengelola relasi antar tabel sessions
 */
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));