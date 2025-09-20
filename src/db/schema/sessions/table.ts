import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users";

/**
 * Tabel sessions untuk JWT token management
 * Menyimpan refresh tokens dan session data
 * 
 * Domain: Authentication
 * Responsibility: Mengelola session dan token management
 */
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  refreshToken: text("refresh_token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});