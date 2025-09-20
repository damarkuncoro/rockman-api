import { roleFeatures } from "./table";

/**
 * TypeScript types untuk role features
 * 
 * Domain: RBAC
 * Responsibility: Menyediakan type safety untuk role features
 */

/**
 * Type untuk select role feature data
 */
export type RoleFeature = typeof roleFeatures.$inferSelect;

/**
 * Type untuk insert role feature data
 */
export type NewRoleFeature = typeof roleFeatures.$inferInsert;