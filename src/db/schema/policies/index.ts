/**
 * Policies Schema Module
 * 
 * Domain: RBAC/ABAC (Role-Based & Attribute-Based Access Control)
 * Responsibility: Mengelola aturan akses berdasarkan atribut pengguna
 * 
 * Struktur modular dengan Separation of Concerns:
 * - table.ts: Database schema definition
 * - relations.ts: Database relations
 * - type_safety.ts: TypeScript types
 * - validations/data_validation.ts: Data layer validation
 * - validations/api_validation.ts: API layer validation
 */

// Database Schema
export { policies } from "./table";

// Relations
export { policiesRelations } from "./relations";

// Type Safety
export type { Policy, NewPolicy } from "./type_safety";

// Data Layer Validations
export {
  insertPolicyDataSchema,
  selectPolicyDataSchema,
  type InsertPolicyData,
  type SelectPolicyData,
} from "./validations/data_validation";

// API Layer Validations
export {
  createPolicySchema,
  type CreatePolicyInput,
} from "./validations/api_validation";