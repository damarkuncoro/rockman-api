import { relations } from "drizzle-orm";
import { changeHistory } from "./table";
import { users } from "../users";

/**
 * Relations untuk change history table
 * Menghubungkan dengan tabel users
 * 
 * Domain: Change Tracking
 * Responsibility: Mendefinisikan relasi antar tabel untuk change history
 * 
 * @description Relasi yang didefinisikan:
 * - user: Many-to-One dengan users table
 */
export const changeHistoryRelations = relations(changeHistory, ({ one }) => ({
  user: one(users, {
    fields: [changeHistory.userId],
    references: [users.id],
  }),
}));