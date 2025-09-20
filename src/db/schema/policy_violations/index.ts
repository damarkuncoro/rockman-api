/**
 * Policy Violations Schema Module
 * 
 * Domain: Policy Violation Monitoring
 * Responsibility: Mencatat dan monitoring pelanggaran kebijakan ABAC
 * 
 * Struktur modular dengan Separation of Concerns:
 * - table.ts: Database schema definition
 * - relations.ts: Database relations
 * - type_safety.ts: TypeScript types
 * - validations/data_validation.ts: Data layer validation
 * - validations/api_validation.ts: API layer validation
 */

// Database Schema
export { policyViolations } from "./table";

// Relations
export { policyViolationsRelations } from "./relations";

// Type Safety
export type { PolicyViolation, NewPolicyViolation } from "./type_safety";

// Data Layer Validations
export {
  insertPolicyViolationDataSchema,
  selectPolicyViolationDataSchema,
  type InsertPolicyViolationData,
  type SelectPolicyViolationData,
} from "./validations/data_validation";

// API Layer Validations
export {
  createPolicyViolationSchema,
  type CreatePolicyViolationInput,
} from "./validations/api_validation";