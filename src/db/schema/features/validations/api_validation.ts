import { z } from "zod";
import { insertFeatureDataSchema } from "./data_validation";

/**
 * Schema validasi API untuk features
 * 
 * Domain: RBAC - API Layer
 * Responsibility: Validasi input API dan request handling untuk features
 */

/**
 * API validation schema untuk create feature
 */
export const createFeatureSchema = insertFeatureDataSchema;

/**
 * API input types untuk request handling
 */
export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;