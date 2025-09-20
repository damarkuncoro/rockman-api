import { pgTable, serial, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { features } from "../features";

/**
 * Tabel policies untuk menyimpan aturan akses berbasis atribut
 * Digunakan untuk ABAC (Attribute-Based Access Control)
 * 
 * Domain: RBAC/ABAC
 * Responsibility: Mengelola aturan akses berdasarkan atribut pengguna
 */
export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  featureId: integer("feature_id").notNull().references(() => features.id, { onDelete: "cascade" }),
  attribute: varchar("attribute", { length: 100 }).notNull(), // 'department', 'region', 'level'
  operator: varchar("operator", { length: 10 }).notNull(), // '==', '!=', '>', '>=', '<', '<=', 'in'
  value: text("value").notNull(), // 'Finance', 'Jakarta', '[1,2,3]'
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});