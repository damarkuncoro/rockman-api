import { z } from "zod";
import { idSchema } from "../../common/schemas";
import { nameSchema } from "../../users/validations/data_validation";

/**
 * Schema validasi data untuk roles
 * 
 * Domain: RBAC - Data Layer
 * Responsibility: Validasi data insert dan select roles
 */

/**
 * Schema untuk insert role data
 */
export const insertRoleDataSchema = z.object({
  name: nameSchema,
  grantsAll: z.boolean().default(false),
});

/**
 * Schema untuk select role data
 */
export const selectRoleDataSchema = z.object({
  id: idSchema,
  name: z.string(),
  grantsAll: z.boolean().nullable(),
  createdAt: z.date(),
});

/**
 * Types untuk data validation
 */
export type InsertRoleData = z.infer<typeof insertRoleDataSchema>;
export type SelectRoleData = z.infer<typeof selectRoleDataSchema>;