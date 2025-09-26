import { z } from "zod";
import { emailSchema, passwordSchema, nameSchema } from "./data_validation";

/**
 * Schema validasi API untuk users
 * 
 * Domain: User Management - API Layer
 * Responsibility: Validasi input API dan request handling untuk users
 */

/**
 * API validation schema untuk create user
 */
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  // ABAC attributes (optional)
  department: z.string().max(100, "Department maksimal 100 karakter").optional(),
  region: z.string().max(100, "Region maksimal 100 karakter").optional(),
  level: z.number().int().min(1, "Level minimal 1").max(10, "Level maksimal 10").optional(),
  // ABAC attributes untuk Customer (optional)
  customerType: z.enum(["personal", "business", "enterprise"]).optional(),
  customerTier: z.enum(["basic", "premium", "vip"]).optional(),
  customerSince: z.string().datetime().optional(),
  customerStatus: z.enum(["active", "inactive", "suspended"]).optional(),
  customerSegment: z.string().max(100, "Segmentasi customer maksimal 100 karakter").optional(),
});

/**
 * API validation schema untuk login
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password diperlukan"),
});

/**
 * Update user ABAC attributes schema
 */
export const updateUserAbacSchema = z.object({
  department: z.string().max(100, "Department maksimal 100 karakter").optional(),
  region: z.string().max(100, "Region maksimal 100 karakter").optional(),
  level: z.number().int().min(1, "Level minimal 1").max(10, "Level maksimal 10").optional(),
  // ABAC attributes untuk Customer (optional)
  customerType: z.enum(["personal", "business", "enterprise"]).optional(),
  customerTier: z.enum(["basic", "premium", "vip"]).optional(),
  customerSince: z.string().datetime().optional(),
  customerStatus: z.enum(["active", "inactive", "suspended"]).optional(),
  customerSegment: z.string().max(100, "Segmentasi customer maksimal 100 karakter").optional(),
});

/**
 * API input types untuk request handling
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserAbacInput = z.infer<typeof updateUserAbacSchema>;