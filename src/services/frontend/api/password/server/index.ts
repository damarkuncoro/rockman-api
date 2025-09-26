/**
 * Server API Module
 * 
 * Domain: Backend Password Operations
 * Responsibility: Handler endpoint untuk operasi password dari sisi server
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani server-side endpoint handlers
 * - DRY: Reusable endpoint handlers
 * - KISS: Interface sederhana untuk backend
 */

export { 
  handleChangePassword, 
  handleResetPassword, 
  handlePasswordStrength,
  extractUserIdFromParams,
  type ApiResponse,
  type PasswordStrengthResponse
} from './endpoint'