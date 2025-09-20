/**
 * Roles Schema Module
 * 
 * Domain: RBAC (Role-Based Access Control)
 * Responsibility: Mengelola role dan permission global
 * 
 * Struktur modular dengan Separation of Concerns:
 * - table.ts: Database schema definition
 * - relations.ts: Database relations
 * - type_safety.ts: TypeScript types
 * - validations/data_validation.ts: Data layer validation
 * - validations/api_validation.ts: API layer validation
 */

// Database Schema
export { roles } from "./table";

// Relations
export { rolesRelations } from "./relations";

// Type Safety
export type { Role, NewRole } from "./type_safety";

// Data Layer Validations
export {
  insertRoleDataSchema,
  selectRoleDataSchema,
  type InsertRoleData,
  type SelectRoleData,
} from "./validations/data_validation";

// API Layer Validations
export {
  createRoleSchema,
  type CreateRoleInput,
} from "./validations/api_validation";