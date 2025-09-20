import { pgTable, serial, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users";
import { features } from "../features";
import { policies } from "../policies";

/**
 * Tabel policy_violations untuk mencatat pelanggaran policy ABAC
 * Digunakan untuk debugging dan security monitoring
 * 
 * Domain: Policy Violation Monitoring
 * Responsibility: Mencatat dan monitoring pelanggaran kebijakan ABAC
 */
export const policyViolations = pgTable("policy_violations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  featureId: integer("feature_id").references(() => features.id, { onDelete: "set null" }),
  policyId: integer("policy_id").references(() => policies.id, { onDelete: "set null" }),
  attribute: varchar("attribute", { length: 100 }).notNull(),
  expectedValue: text("expected_value").notNull(),
  actualValue: text("actual_value"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});