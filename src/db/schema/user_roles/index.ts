/**
 * User Roles Schema Module
 * 
 * Domain: RBAC
 * Responsibility: Mengelola assignment role kepada user
 * 
 * Struktur modular dengan Separation of Concerns:
 * - table.ts: Database schema definition
 * - relations.ts: Database relations
 * - type_safety.ts: TypeScript types
 * - validations/data_validation.ts: Data layer validation
 * - validations/api_validation.ts: API layer validation
 */

// Database Schema
export { userRoles } from "./table";

// Relations
export { userRolesRelations } from "./relations";

// Type Safety
export type { UserRole, NewUserRole } from "./type_safety";

// Data Layer Validations
export {
  insertUserRoleDataSchema,
  selectUserRoleDataSchema,
  type InsertUserRoleData,
  type SelectUserRoleData,
} from "./validations/data_validation";

// API Layer Validations
export {
  assignRoleSchema,
  type AssignRoleInput,
} from "./validations/api_validation";