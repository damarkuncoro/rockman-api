/**
 * Role Features Schema Module
 * 
 * Domain: RBAC
 * Responsibility: Mengelola permission CRUD untuk setiap role-feature combination
 * 
 * Struktur modular dengan Separation of Concerns:
 * - table.ts: Database schema definition
 * - relations.ts: Database relations
 * - type_safety.ts: TypeScript types
 * - validations/data_validation.ts: Data layer validation
 * - validations/api_validation.ts: API layer validation
 */

// Database Schema
export { roleFeatures } from "./table";

// Relations
export { roleFeaturesRelations } from "./relations";

// Type Safety
export type { RoleFeature, NewRoleFeature } from "./type_safety";

// Data Layer Validations
export {
  insertRoleFeatureDataSchema,
  selectRoleFeatureDataSchema,
  type InsertRoleFeatureData,
  type SelectRoleFeatureData,
} from "./validations/data_validation";

// API Layer Validations
export {
  createRoleFeatureSchema,
  type CreateRoleFeatureInput,
} from "./validations/api_validation";