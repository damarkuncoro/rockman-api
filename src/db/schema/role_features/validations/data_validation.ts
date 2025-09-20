import { z } from "zod";
import { idSchema } from "../../common/schemas";

/**
 * Schema validasi data untuk role features
 * 
 * Domain: RBAC - Data Layer
 * Responsibility: Validasi data insert dan select role features
 */

/**
 * Schema untuk insert role feature data
 */
export const insertRoleFeatureDataSchema = z.object({
  roleId: idSchema,
  featureId: idSchema,
  canCreate: z.boolean().default(false),
  canRead: z.boolean().default(false),
  canUpdate: z.boolean().default(false),
  canDelete: z.boolean().default(false),
});

/**
 * Schema untuk select role feature data
 */
export const selectRoleFeatureDataSchema = z.object({
  id: idSchema,
  roleId: z.number(),
  featureId: z.number(),
  canCreate: z.boolean().nullable(),
  canRead: z.boolean().nullable(),
  canUpdate: z.boolean().nullable(),
  canDelete: z.boolean().nullable(),
});

/**
 * Types untuk data validation
 */
export type InsertRoleFeatureData = z.infer<typeof insertRoleFeatureDataSchema>;
export type SelectRoleFeatureData = z.infer<typeof selectRoleFeatureDataSchema>;