import { pgTable, serial, integer, varchar, text, timestamp, json } from "drizzle-orm/pg-core";
import { users } from "../users";

/**
 * Tabel change_history untuk mencatat perubahan data penting
 * Digunakan untuk audit trail dan rollback capability
 * 
 * Domain: Change Tracking
 * Responsibility: Mencatat dan tracking perubahan data sistem
 * 
 * @description Schema database untuk change history yang mencatat:
 * - Perubahan data pada tabel penting
 * - Audit trail untuk compliance
 * - Rollback capability untuk recovery
 * - Tracking aktivitas user pada data
 */
export const changeHistory = pgTable("change_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  tableName: varchar("table_name", { length: 100 }).notNull(),
  recordId: integer("record_id").notNull(),
  action: varchar("action", { length: 10 }).notNull(), // 'create', 'update', 'delete'
  oldValues: json("old_values"),
  newValues: json("new_values"),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});