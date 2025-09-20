import { z } from "zod";
import { idSchema } from "../../common/schemas";

/**
 * Schema validasi data untuk policy violations
 * 
 * Domain: Policy Violation Monitoring - Data Layer
 * Responsibility: Validasi data insert dan select policy violations
 */

/**
 * Schema untuk insert policy violation data
 */
export const insertPolicyViolationDataSchema = z.object({
  userId: idSchema.optional(),
  featureId: idSchema.optional(),
  policyId: idSchema.optional(),
  attribute: z.string().min(1).max(100),
  expectedValue: z.string().min(1),
  actualValue: z.string().optional(),
});

/**
 * Schema untuk select policy violation data
 */
export const selectPolicyViolationDataSchema = z.object({
  id: idSchema,
  userId: z.number().nullable(),
  featureId: z.number().nullable(),
  policyId: z.number().nullable(),
  attribute: z.string(),
  expectedValue: z.string(),
  actualValue: z.string().nullable(),
  createdAt: z.date(),
});

/**
 * Types untuk data validation
 */
export type InsertPolicyViolationData = z.infer<typeof insertPolicyViolationDataSchema>;
export type SelectPolicyViolationData = z.infer<typeof selectPolicyViolationDataSchema>;