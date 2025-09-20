/**
 * Features Schema Module
 * 
 * Domain: RBAC (Role-Based Access Control)
 * Responsibility: Mengelola fitur dan permission sistem
 * 
 * Struktur modular dengan Separation of Concerns:
 * - table.ts: Database schema definition
 * - relations.ts: Database relations
 * - type_safety.ts: TypeScript types
 * - validations/data_validation.ts: Data layer validation
 * - validations/api_validation.ts: API layer validation
 */

// Database Schema
export { features } from "./table";

// Relations
export { featuresRelations } from "./relations";

// Type Safety
export type { Feature, NewFeature } from "./type_safety";

// Data Layer Validations
export {
  insertFeatureDataSchema,
  selectFeatureDataSchema,
  type InsertFeatureData,
  type SelectFeatureData,
} from "./validations/data_validation";

// API Layer Validations
export {
  createFeatureSchema,
  type CreateFeatureInput,
} from "./validations/api_validation";