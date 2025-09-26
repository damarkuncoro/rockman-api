/**
 * Frontend Service: Users Shared Module Index
 * 
 * Domain: User Management - Shared Operations
 * Responsibility: Central export point untuk semua shared utilities
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya sebagai export aggregator untuk shared
 * - DRY: Single point of import untuk shared module
 * - KISS: Interface yang sederhana
 * - SOLID: Dependency inversion principle
 */

// Export validation functions dan structure
export { VALIDATE } from './validation'

// Export types
export type {
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  PasswordStatusResponse,
  ApiResponse,
  PasswordStrengthResult
} from './types'