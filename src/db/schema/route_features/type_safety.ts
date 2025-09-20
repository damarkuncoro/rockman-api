import { routeFeatures } from "./table";

/**
 * TypeScript types untuk route features
 * 
 * Domain: RBAC
 * Responsibility: Menyediakan type safety untuk route features
 */

/**
 * Type untuk select route feature data
 */
export type RouteFeature = typeof routeFeatures.$inferSelect;

/**
 * Type untuk insert route feature data
 */
export type NewRouteFeature = typeof routeFeatures.$inferInsert;