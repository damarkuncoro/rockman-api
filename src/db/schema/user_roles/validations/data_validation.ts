import { z } from "zod";
import { idSchema } from "../../common/schemas";

/**
 * Schema validasi data untuk user roles
 * 
 * Domain: RBAC - Data Layer
 * Responsibility: Validasi data insert dan select user roles
 */

/**
 * Schema untuk insert user role data
 */
export const insertUserRoleDataSchema = z.object({
  userId: idSchema,
  roleId: idSchema,
});

/**
 * Schema untuk select user role data
 */
export const selectUserRoleDataSchema = z.object({
  id: idSchema,
  userId: z.number(),
  roleId: z.number(),
});

/**
 * Types untuk data validation
 */
export type InsertUserRoleData = z.infer<typeof insertUserRoleDataSchema>;
export type SelectUserRoleData = z.infer<typeof selectUserRoleDataSchema>;