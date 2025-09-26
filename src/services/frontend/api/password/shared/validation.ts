/**
 * Password Validation Schema
 * 
 * Domain: Frontend API - Password Validation
 * Responsibility: Validasi input password operations
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani validasi password
 * - DRY: Reusable validation functions
 * - KISS: Validasi yang sederhana dan jelas
 */

import { z } from 'zod'

/**
 * Schema validasi untuk change password request
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Password lama wajib diisi')
    .max(255, 'Password lama terlalu panjang'),
  
  newPassword: z
    .string()
    .min(8, 'Password baru minimal 8 karakter')
    .max(255, 'Password baru terlalu panjang')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol'
    ),
  
  confirmPassword: z
    .string()
    .min(1, 'Konfirmasi password wajib diisi')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Password baru dan konfirmasi tidak cocok',
  path: ['confirmPassword']
})

/**
 * Schema validasi untuk reset password request
 */
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .max(255, 'Email terlalu panjang')
})

/**
 * Schema validasi untuk password strength check
 */
export const passwordStrengthSchema = z.object({
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .max(255, 'Password terlalu panjang')
})

/**
 * Type definitions dari schema
 */
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>
export type PasswordStrengthRequest = z.infer<typeof passwordStrengthSchema>

/**
 * Validation functions untuk digunakan di komponen
 */
export const validateChangePassword = (data: unknown) => {
  return changePasswordSchema.safeParse(data)
}

export const validateResetPassword = (data: unknown) => {
  return resetPasswordSchema.safeParse(data)
}

export const validatePasswordStrength = (data: unknown) => {
  return passwordStrengthSchema.safeParse(data)
}

/**
 * Helper functions untuk validasi individual
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && 
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)
}

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword
}