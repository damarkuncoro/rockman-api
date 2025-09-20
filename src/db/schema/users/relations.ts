import { relations } from "drizzle-orm";
import { users } from "./table";
import { sessions } from "../sessions";

/**
 * Relations untuk users table
 * 
 * Domain: User Management
 * Responsibility: Mengelola relasi antar tabel users
 */
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));