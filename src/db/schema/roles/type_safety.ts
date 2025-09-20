import { roles } from "./table";

/**
 * TypeScript types untuk type safety roles
 * 
 * Domain: RBAC
 * Responsibility: Menyediakan type safety untuk roles
 */
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;