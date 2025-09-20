import { pgTable, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

/**
 * Tabel roles untuk menyimpan daftar role dalam sistem RBAC
 * 
 * Domain: RBAC
 * Responsibility: Mengelola role dan permission global
 */
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  grantsAll: boolean("grants_all").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});