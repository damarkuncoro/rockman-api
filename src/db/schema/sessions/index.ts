/**
 * Sessions Schema Module
 * 
 * Domain: Authentication
 * Responsibility: Mengelola session dan token management
 * 
 * Struktur modular dengan Separation of Concerns:
 * - table.ts: Database schema definition
 * - relations.ts: Database relations
 * - type_safety.ts: TypeScript types
 * - validations/data_validation.ts: Data layer validation
 * - validations/api_validation.ts: API layer validation
 */

// Database Schema
export { sessions } from "./table";

// Relations
export { sessionsRelations } from "./relations";

// Type Safety
export type { Session, NewSession } from "./type_safety";

// Data Layer Validations
export {
  insertSessionDataSchema,
  selectSessionDataSchema,
  type InsertSessionData,
  type SelectSessionData,
} from "./validations/data_validation";

// API Layer Validations
export {
  createSessionSchema,
  refreshTokenSchema,
  type CreateSessionInput,
  type RefreshTokenInput,
} from "./validations/api_validation";