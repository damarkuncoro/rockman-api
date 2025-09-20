import { z } from "zod";
import { idSchema } from "../../common/schemas";

/**
 * Schema validasi untuk email
 */
export const emailSchema = z
  .string()
  .min(1, "Email diperlukan")
  .email("Format email tidak valid")
  .max(255, "Email maksimal 255 karakter");

/**
 * Schema validasi untuk password
 */
export const passwordSchema = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .max(100, "Password maksimal 100 karakter")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
    "Password harus mengandung minimal 1 huruf kecil, 1 huruf besar, dan 1 angka");

/**
 * Schema validasi untuk nama (first name, last name, dll)
 */
export const nameSchema = z
  .string()
  .min(1, "Nama diperlukan")
  .max(100, "Nama maksimal 100 karakter")
  .regex(/^[a-zA-Z\s]+$/, "Nama hanya boleh mengandung huruf dan spasi");

/**
 * Schema validasi data untuk users
 * 
 * Domain: User Management - Data Layer
 * Responsibility: Validasi data insert dan select users
 */

/**
 * Schema validasi untuk username
 */
export const usernameSchema = z
  .string()
  .min(3, "Username minimal 3 karakter")
  .max(50, "Username maksimal 50 karakter")
  .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh mengandung huruf, angka, dan underscore");

/**
 * Authentication schemas
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password diperlukan"),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token diperlukan"),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Password saat ini diperlukan"),
  newPassword: passwordSchema,
});
export const insertUserDataSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  passwordHash: z.string().min(1),
  active: z.boolean().default(true),
  // ABAC attributes (optional)
  department: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  level: z.number().int().min(1).max(10).optional(),
});

/**
 * Schema untuk select user data
 */
export const selectUserDataSchema = z.object({
  id: idSchema,
  name: z.string(),
  email: z.string(),
  passwordHash: z.string(),
  active: z.boolean().nullable(),
  rolesUpdatedAt: z.date().nullable(),
  department: z.string().nullable(),
  region: z.string().nullable(),
  level: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Types untuk data validation
 */
export type InsertUserData = z.infer<typeof insertUserDataSchema>;
export type SelectUserData = z.infer<typeof selectUserDataSchema>;