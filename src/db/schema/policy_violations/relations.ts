import { relations } from "drizzle-orm";
import { policyViolations } from "./table";
import { users } from "../users";
import { features } from "../features";
import { policies } from "../policies";

/**
 * Relations untuk policy violations table
 * 
 * Domain: Policy Violation Monitoring
 * Responsibility: Mengelola relasi antar tabel policy violations
 */
export const policyViolationsRelations = relations(policyViolations, ({ one }) => ({
  user: one(users, {
    fields: [policyViolations.userId],
    references: [users.id],
  }),
  feature: one(features, {
    fields: [policyViolations.featureId],
    references: [features.id],
  }),
  policy: one(policies, {
    fields: [policyViolations.policyId],
    references: [policies.id],
  }),
}));