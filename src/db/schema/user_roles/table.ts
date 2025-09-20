import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { users } from "../users";
import { roles } from "../roles";

/**
 * Tabel user_roles untuk menyimpan assignment role ke user
 * Junction table untuk many-to-many relationship antara users dan roles
 * 
 * Domain: RBAC
 * Responsibility: Mengelola assignment role kepada user
 */
export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: integer("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
});