import { z } from "zod";

/**
 * Validasi untuk API user phones
 * 
 * Domain: User Management - Phone Numbers
 * Responsibility: Validasi input API untuk nomor telepon user
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani validasi API untuk phone numbers
 * - DRY: Reusable validation schemas
 * - KISS: Schema validasi yang sederhana dan jelas
 * - SOLID: Separation of concerns untuk API validation
 */

/**
 * Schema validasi untuk create user phone
 */
export const createUserPhoneSchema = z.object({
  userId: z.number().int().positive("ID user harus berupa angka positif"),
  
  label: z.string()
    .min(1, "Label nomor telepon harus diisi")
    .max(50, "Label nomor telepon maksimal 50 karakter")
    .refine(val => val.trim().length > 0, "Label tidak boleh hanya berisi spasi"),
  
  phoneNumber: z.string()
    .min(8, "Nomor telepon minimal 8 digit")
    .max(20, "Nomor telepon maksimal 20 karakter")
    .regex(/^[0-9+\-\s()]+$/, "Nomor telepon hanya boleh berisi angka, +, -, spasi, dan tanda kurung"),
  
  countryCode: z.string()
    .regex(/^\+[1-9][0-9]{0,3}$/, "Kode negara harus berformat +xx (contoh: +62)")
    .default("+62"),
  
  isDefault: z.boolean().default(false),
  
  isVerified: z.boolean().default(false),
});

/**
 * Schema validasi untuk update user phone
 */
export const updateUserPhoneSchema = createUserPhoneSchema.partial();

/**
 * Schema validasi untuk set default phone
 */
export const setDefaultPhoneSchema = z.object({
  phoneId: z.number().int().positive("ID nomor telepon harus berupa angka positif"),
});

/**
 * Schema validasi untuk verify phone
 */
export const verifyPhoneSchema = z.object({
  phoneId: z.number().int().positive("ID nomor telepon harus berupa angka positif"),
  verificationCode: z.string()
    .min(4, "Kode verifikasi minimal 4 karakter")
    .max(10, "Kode verifikasi maksimal 10 karakter")
    .regex(/^[0-9]+$/, "Kode verifikasi hanya boleh berisi angka"),
});

/**
 * Schema validasi untuk bulk phone operations
 */
export const bulkPhoneSchema = z.object({
  phoneIds: z.array(z.number().int().positive()).min(1, "Minimal satu ID nomor telepon harus dipilih"),
  action: z.enum(["delete", "activate", "deactivate"], {
    message: "Aksi harus berupa 'delete', 'activate', atau 'deactivate'"
  }),
});

/**
 * Type definitions
 */
export type CreateUserPhoneInput = z.infer<typeof createUserPhoneSchema>;
export type UpdateUserPhoneInput = z.infer<typeof updateUserPhoneSchema>;
export type SetDefaultPhoneInput = z.infer<typeof setDefaultPhoneSchema>;
export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>;
export type BulkPhoneInput = z.infer<typeof bulkPhoneSchema>;