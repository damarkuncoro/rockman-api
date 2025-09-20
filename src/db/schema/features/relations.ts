import { relations } from "drizzle-orm";
import { features } from "./table";

/**
 * Relations untuk features table
 * 
 * Domain: RBAC
 * Responsibility: Mengelola relasi antar tabel features
 */
export const featuresRelations = relations(features, () => ({
  // roleFeatures: many(roleFeatures), // akan diimport dari role-features.ts
  // routeFeatures: many(routeFeatures), // akan diimport dari route-features.ts
}));