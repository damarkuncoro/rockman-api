import { z } from "zod";
import { idSchema } from "../../common/schemas";

/**
 * Schema validasi data untuk sessions
 * 
 * Domain: Authentication - Data Layer
 * Responsibility: Validasi data insert dan select sessions
 */

/**
 * Schema untuk insert session data
 */
export const insertSessionDataSchema = z.object({
  userId: idSchema,
  refreshToken: z.string().min(1, "Refresh token is required"),
  expiresAt: z.date(),
});

/**
 * Schema untuk select session data
 */
export const selectSessionDataSchema = z.object({
  id: idSchema,
  userId: idSchema,
  refreshToken: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

/**
 * Types untuk data validation
 */
export type InsertSessionData = z.infer<typeof insertSessionDataSchema>;
export type SelectSessionData = z.infer<typeof selectSessionDataSchema>;