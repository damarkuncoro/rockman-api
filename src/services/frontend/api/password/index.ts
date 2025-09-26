/**
 * Password API Module
 * 
 * Domain: Password Operations
 * Responsibility: Central export point untuk semua password-related operations
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya sebagai aggregator/export point
 * - DRY: Centralized exports untuk reusability
 * - KISS: Simple interface untuk consumer
 */

// ===== SHARED EXPORTS =====
// Validation schemas dan functions
export {
  changePasswordSchema,
  resetPasswordSchema,
  passwordStrengthSchema,
  type ChangePasswordRequest,
  type ResetPasswordRequest,
  type PasswordStrengthRequest,
  validateChangePassword,
  validateResetPassword,
  validatePasswordStrength,
  isValidPassword,
  isValidEmail,
  passwordsMatch
} from './shared/validation'

// Types
export type {
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  PasswordStatusResponse,
  PasswordStrengthResult,
  ApiResponse
} from './shared/types'

// ===== SERVER EXPORTS =====
// Server handlers dan types
export {
  handleChangePassword,
  handleResetPassword,
  handlePasswordStrength,
  type PasswordStrengthResponse
} from './server/endpoint'

// ===== CLIENT EXPORTS =====
// Client API functions
export {
  PasswordClientAPI,
  changePassword,
  resetPassword,
  checkPasswordStrength
} from './client'

// Default export untuk convenience
export { PasswordClientAPI as default } from './client'