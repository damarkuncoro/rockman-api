import { pgTable, serial, integer, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";

/**
 * Tabel users untuk menyimpan data pengguna
 * Menggunakan PostgreSQL dengan serial primary key
 * Ditambahkan ABAC attributes: department, region, level
 * 
 * Domain: User Management
 * Responsibility: Mengelola data pengguna dan atribut ABAC
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  active: boolean("active").default(true),
  rolesUpdatedAt: timestamp("roles_updated_at", { withTimezone: true }),
  // ABAC attributes untuk attribute-based access control
  department: varchar("department", { length: 100 }),
  region: varchar("region", { length: 100 }),
  level: integer("level"), // seniority/grade level
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});