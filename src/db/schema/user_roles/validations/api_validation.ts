import { z } from "zod";
import { insertUserRoleDataSchema } from "./data_validation";

/**
 * Schema validasi API untuk user roles
 * 
 * Domain: RBAC - API Layer
 * Responsibility: Validasi input API dan request handling untuk user roles
 */

/**
 * API validation schema untuk assign role
 */
export const assignRoleSchema = insertUserRoleDataSchema;

/**
 * API input types untuk request handling
 */
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;