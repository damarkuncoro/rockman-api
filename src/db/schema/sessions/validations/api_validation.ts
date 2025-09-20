import { z } from "zod";
import { insertSessionDataSchema } from "./data_validation";

/**
 * Schema validasi API untuk sessions
 * 
 * Domain: Authentication - API Layer
 * Responsibility: Validasi input API dan request handling untuk sessions
 */

/**
 * API validation schema untuk create session
 */
export const createSessionSchema = insertSessionDataSchema;

/**
 * API validation schema untuk refresh token
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

/**
 * API input types untuk request handling
 */
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;