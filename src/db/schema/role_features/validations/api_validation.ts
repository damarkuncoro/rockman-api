import { z } from "zod";
import { insertRoleFeatureDataSchema } from "./data_validation";

/**
 * Schema validasi API untuk role features
 * 
 * Domain: RBAC - API Layer
 * Responsibility: Validasi input API dan request handling untuk role features
 */

/**
 * API validation schema untuk create role feature
 */
export const createRoleFeatureSchema = insertRoleFeatureDataSchema;

/**
 * API input types untuk request handling
 */
export type CreateRoleFeatureInput = z.infer<typeof createRoleFeatureSchema>;