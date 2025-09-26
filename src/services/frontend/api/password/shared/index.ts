/**
 * Shared Module
 * 
 * Domain: Common Password Utilities
 * Responsibility: Types, validasi, dan utilities yang digunakan bersama
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani shared components
 * - DRY: Single source of truth untuk types dan validasi
 * - KISS: Interface sederhana dan konsisten
 */

// Export types
export type {
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  PasswordStatusResponse,
  ApiResponse,
  PasswordStrengthResult
} from './types'

// Export validation schemas dan functions
export { 
  changePasswordSchema, 
  resetPasswordSchema, 
  passwordStrengthSchema,
  validateChangePassword,
  validateResetPassword,
  validatePasswordStrength,
  isValidPassword,
  isValidEmail,
  passwordsMatch,
  type ChangePasswordRequest,
  type ResetPasswordRequest,
  type PasswordStrengthRequest
} from './validation'