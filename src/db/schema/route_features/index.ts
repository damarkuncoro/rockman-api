/**
 * Route Features Schema Module
 * 
 * Domain: RBAC
 * Responsibility: Mengelola mapping antara route dan feature yang diperlukan
 * 
 * Struktur modular dengan Separation of Concerns:
 * - table.ts: Database schema definition
 * - relations.ts: Database relations
 * - type_safety.ts: TypeScript types
 * - validations/data_validation.ts: Data layer validation
 * - validations/api_validation.ts: API layer validation
 */

// Database Schema
export { routeFeatures } from "./table";

// Relations
export { routeFeaturesRelations } from "./relations";

// Type Safety
export type { RouteFeature, NewRouteFeature } from "./type_safety";

// Data Layer Validations
export {
  insertRouteFeatureDataSchema,
  selectRouteFeatureDataSchema,
  type InsertRouteFeatureData,
  type SelectRouteFeatureData,
} from "./validations/data_validation";

// API Layer Validations
export {
  createRouteFeatureSchema,
  type CreateRouteFeatureInput,
} from "./validations/api_validation";