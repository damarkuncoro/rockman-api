import { z } from "zod";
import { insertRouteFeatureDataSchema } from "./data_validation";

/**
 * Schema validasi API untuk route features
 * 
 * Domain: RBAC - API Layer
 * Responsibility: Validasi input API dan request handling untuk route features
 */

/**
 * API validation schema untuk create route feature
 */
export const createRouteFeatureSchema = z.object({
  path: z.string().min(1).max(255),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]).optional(),
  featureId: z.number().int().positive(),
});

/**
 * API input types untuk request handling
 */
export type CreateRouteFeatureInput = z.infer<typeof createRouteFeatureSchema>;