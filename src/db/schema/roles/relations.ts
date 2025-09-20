import { relations } from "drizzle-orm";
import { roles } from "./table";

/**
 * Relations untuk roles table
 * 
 * Domain: RBAC
 * Responsibility: Mengelola relasi antar tabel roles
 */
export const rolesRelations = relations(roles, () => ({
  // roleFeatures: many(roleFeatures), // akan diimport dari role-features.ts
  // userRoles: many(userRoles), // akan diimport dari user-roles.ts
}));