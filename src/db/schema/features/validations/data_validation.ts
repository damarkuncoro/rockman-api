import { z } from "zod";
import { idSchema } from "../../common/schemas";
import { nameSchema } from "../../users/validations/data_validation";

/**
 * Schema validasi data untuk features
 * 
 * Domain: RBAC - Data Layer
 * Responsibility: Validasi data insert dan select features menggunakan shared schemas
 */

/**
 * Schema untuk insert feature data
 */
export const insertFeatureDataSchema = z.object({
  name: nameSchema,
  description: z.string().optional(),
  category: z.string().max(50).default("General"),
});

/**
 * Schema untuk select feature data
 */
export const selectFeatureDataSchema = z.object({
  id: idSchema,
  name: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  createdAt: z.date(),
});

/**
 * Types untuk data validation
 */
export type InsertFeatureData = z.infer<typeof insertFeatureDataSchema>;
export type SelectFeatureData = z.infer<typeof selectFeatureDataSchema>;