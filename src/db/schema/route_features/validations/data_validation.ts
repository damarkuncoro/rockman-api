import { z } from "zod";
import { idSchema, pathSchema, httpMethodSchema } from "../../common/schemas";

/**
 * Schema validasi data untuk route features
 * 
 * Domain: RBAC - Data Layer
 * Responsibility: Validasi data insert dan select route features
 */

/**
 * Schema untuk insert route feature data
 */
export const insertRouteFeatureDataSchema = z.object({
  path: pathSchema,
  method: httpMethodSchema.optional(),
  featureId: idSchema,
});

/**
 * Schema untuk select route feature data
 */
export const selectRouteFeatureDataSchema = z.object({
  id: idSchema,
  path: z.string(),
  method: z.string().nullable(),
  featureId: z.number(),
});

/**
 * Types untuk data validation
 */
export type InsertRouteFeatureData = z.infer<typeof insertRouteFeatureDataSchema>;
export type SelectRouteFeatureData = z.infer<typeof selectRouteFeatureDataSchema>;