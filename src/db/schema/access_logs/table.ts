import { pgTable, serial, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users";
import { roles } from "../roles";
import { features } from "../features";

/**
 * Tabel access_logs untuk mencatat semua akses ke fitur
 * Digunakan untuk audit trail dan monitoring
 * 
 * Domain: Access Monitoring
 * Responsibility: Mencatat dan monitoring akses ke fitur sistem
 * 
 * @description Schema database untuk access logs yang mencatat:
 * - Akses user ke fitur tertentu
 * - Keputusan izin (allow/deny)
 * - Audit trail untuk compliance
 * - Monitoring aktivitas sistem
 */
export const accessLogs = pgTable("access_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  roleId: integer("role_id").references(() => roles.id, { onDelete: "set null" }),
  featureId: integer("feature_id").references(() => features.id, { onDelete: "set null" }),
  path: varchar("path", { length: 255 }).notNull(),
  method: varchar("method", { length: 10 }),
  decision: varchar("decision", { length: 10 }).notNull(), // 'allow' / 'deny'
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
