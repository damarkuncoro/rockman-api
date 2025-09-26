/**
 * Frontend Service: Email Shared Module Index
 * 
 * Domain: User Management - Email Shared Utilities
 * Responsibility: Central export point untuk semua utilities dan validasi email
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya sebagai export aggregator untuk shared
 * - DRY: Single point of import untuk shared module
 * - KISS: Interface yang sederhana
 * - SOLID: Dependency inversion principle
 */

// Export semua validation functions
export {
  validateEmailFormat,
  validateEmailRequired,
  validateEmailLength,
  validateEmailDomain,
  validateEmailComplete,
  validateChangeEmailData,
  validateUpdateEmailData,
  EmailValidation
} from './validation'