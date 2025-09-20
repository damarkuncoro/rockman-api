import { policyViolations } from "./table";

/**
 * TypeScript types untuk policy violations
 * 
 * Domain: Policy Violation Monitoring
 * Responsibility: Menyediakan type safety untuk policy violations
 */

/**
 * Type untuk select policy violation data
 */
export type PolicyViolation = typeof policyViolations.$inferSelect;

/**
 * Type untuk insert policy violation data
 */
export type NewPolicyViolation = typeof policyViolations.$inferInsert;