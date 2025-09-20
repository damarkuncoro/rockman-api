import { relations } from "drizzle-orm";
import { routeFeatures } from "./table";
import { features } from "../features";

/**
 * Relations untuk route_features table
 * 
 * Domain: RBAC
 * Responsibility: Mengelola relasi antar tabel route features
 */
export const routeFeaturesRelations = relations(routeFeatures, ({ one }) => ({
  feature: one(features, {
    fields: [routeFeatures.featureId],
    references: [features.id],
  }),
}));