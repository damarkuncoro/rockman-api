import { relations } from "drizzle-orm";
import { userRoles } from "./table";
import { users } from "../users";
import { roles } from "../roles";

/**
 * Relations untuk user_roles table
 * 
 * Domain: RBAC
 * Responsibility: Mengelola relasi antar tabel user roles
 */
export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));