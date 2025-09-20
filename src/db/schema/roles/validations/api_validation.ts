import { z } from "zod";
import { insertRoleDataSchema } from "./data_validation";

/**
 * Schema validasi API untuk roles
 * 
 * Domain: RBAC - API Layer
 * Responsibility: Validasi input API dan request handling untuk roles
 */

/**
 * API validation schema untuk create role
 */
export const createRoleSchema = insertRoleDataSchema;

/**
 * API input types untuk request handling
 */
export type CreateRoleInput = z.infer<typeof createRoleSchema>;