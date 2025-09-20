import { features } from "./table";

/**
 * TypeScript types untuk type safety features
 * 
 * Domain: RBAC
 * Responsibility: Menyediakan type safety untuk features
 */
export type Feature = typeof features.$inferSelect;
export type NewFeature = typeof features.$inferInsert;