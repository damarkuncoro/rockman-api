import { relations } from "drizzle-orm";
import { policies } from "./table";
import { features } from "../features";

/**
 * Relations untuk policies table
 * 
 * Domain: RBAC/ABAC
 * Responsibility: Mengelola relasi antar tabel policies
 */
export const policiesRelations = relations(policies, ({ one }) => ({
  feature: one(features, {
    fields: [policies.featureId],
    references: [features.id],
  }),
}));