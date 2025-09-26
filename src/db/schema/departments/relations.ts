import { relations } from "drizzle-orm";
import { departments } from "./table";
import { users } from "../users";

/**
 * Definisi relasi untuk tabel departments
 * Menghubungkan dengan users
 */
export const departmentsRelations = relations(departments, ({ many }) => ({
  // One-to-many: satu department bisa memiliki banyak users
  users: many(users),
}));