import { userRoles } from "./table";

/**
 * TypeScript types untuk user roles
 * 
 * Domain: RBAC
 * Responsibility: Menyediakan type safety untuk user roles
 */

/**
 * Type untuk select user role data
 */
export type UserRole = typeof userRoles.$inferSelect;

/**
 * Type untuk insert user role data
 */
export type NewUserRole = typeof userRoles.$inferInsert;