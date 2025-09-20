import { z } from "zod";
import { idSchema } from "../../common/schemas";

/**
 * Schema validasi data untuk policies
 * 
 * Domain: RBAC/ABAC - Data Layer
 * Responsibility: Validasi data insert dan select policies
 */

/**
 * Schema untuk insert policy data
 */
export const insertPolicyDataSchema = z.object({
  featureId: idSchema,
  attribute: z.string().min(1).max(100),
  operator: z.enum(["==", "!=", ">", ">=", "<", "<=", "in"]),
  value: z.string().min(1),
});

/**
 * Schema untuk select policy data
 */
export const selectPolicyDataSchema = z.object({
  id: idSchema,
  featureId: z.number(),
  attribute: z.string(),
  operator: z.string(),
  value: z.string(),
  createdAt: z.date(),
});

/**
 * Types untuk data validation
 */
export type InsertPolicyData = z.infer<typeof insertPolicyDataSchema>;
export type SelectPolicyData = z.infer<typeof selectPolicyDataSchema>;