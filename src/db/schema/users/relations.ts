import { relations } from "drizzle-orm";
import { users } from "./table";
import { sessions } from "../sessions";
import { departments } from "../departments";
import { userAddresses } from "../user_addresses";

/**
 * Definisi relasi untuk tabel users
 * Menghubungkan dengan sessions, departments, dan user_addresses
 */
export const usersRelations = relations(users, ({ many, one }) => ({
  // One-to-many: satu user bisa memiliki banyak sessions
  sessions: many(sessions),
  
  // One-to-many: satu user bisa memiliki banyak alamat
  addresses: many(userAddresses),
  
  // Many-to-one: banyak user bisa berada di satu department
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
}));