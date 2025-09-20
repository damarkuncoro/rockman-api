import { relations } from "drizzle-orm";
import { roleFeatures } from "./table";
import { roles } from "../roles";
import { features } from "../features";

/**
 * Relations untuk role_features table
 * 
 * Domain: RBAC
 * Responsibility: Mengelola relasi antar tabel role features
 */
export const roleFeaturesRelations = relations(roleFeatures, ({ one }) => ({
  role: one(roles, {
    fields: [roleFeatures.roleId],
    references: [roles.id],
  }),
  feature: one(features, {
    fields: [roleFeatures.featureId],
    references: [features.id],
  }),
}));