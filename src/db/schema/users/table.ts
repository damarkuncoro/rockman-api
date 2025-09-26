import { pgTable, serial, integer, varchar, text, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { departments } from "../departments";

/**
 * Tabel users untuk menyimpan data pengguna sistem
 * Menggunakan foreign key ke tabel departments untuk normalisasi yang lebih baik
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  active: boolean("active").default(true),
  rolesUpdatedAt: timestamp("roles_updated_at", { withTimezone: true }),
  // ABAC attributes untuk attribute-based access control
  departmentId: integer("department_id").references(() => departments.id), // Foreign key ke tabel departments
  region: varchar("region", { length: 100 }),
  level: integer("level"), // seniority/grade level
  
  // ABAC attributes untuk Customer
  customerType: varchar("customer_type", { length: 50 }), // personal, business, enterprise
  customerTier: varchar("customer_tier", { length: 50 }), // basic, premium, vip
  customerSince: date("customer_since"), // tanggal menjadi customer
  customerStatus: varchar("customer_status", { length: 50 }), // active, inactive, suspended
  customerSegment: varchar("customer_segment", { length: 100 }), // segmentasi customer (retail, corporate, dll)
  
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});