import { policies } from "./table";

/**
 * TypeScript types untuk type safety policies
 * 
 * Domain: RBAC/ABAC
 * Responsibility: Menyediakan type safety untuk policies
 */
export type Policy = typeof policies.$inferSelect;
export type NewPolicy = typeof policies.$inferInsert;