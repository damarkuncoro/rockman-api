/**
 * Frontend Service: Email Module Index
 * 
 * Domain: User Management - Email Module
 * Responsibility: Central export point untuk semua fungsi email
 * 
 * Struktur Direktori:
 * - client/: Operasi frontend (API calls, UI logic)
 * - server/: Operasi backend (handlers, middleware) - placeholder
 * - shared/: Utilities bersama (validasi, types, constants)
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya sebagai export aggregator
 * - DRY: Single point of import untuk email module
 * - KISS: Interface yang sederhana
 * - SOLID: Dependency inversion principle
 */

// Export semua interfaces dan types dari client
export type {
  UpdateEmailRequest,
  UpdateEmailResponse,
  EmailStatusResponse,
  ApiResponse,
  ChangeEmailRequest,
  VerifyEmailRequest
} from './client'

// Import dan re-export endpoint functions dari client
import {
  getEmailStatus,
  changeEmail,
  verifyEmail,
  updateEmail,
  EmailEndpoints
} from './client'

// Import dan re-export validation functions dari shared
import {
  validateEmailFormat,
  validateEmailRequired,
  validateEmailLength,
  validateEmailDomain,
  validateEmailComplete,
  validateChangeEmailData,
  validateUpdateEmailData,
  EmailValidation
} from './shared'

// Re-export semua endpoint functions
export {
  getEmailStatus,
  changeEmail,
  verifyEmail,
  updateEmail,
  EmailEndpoints
}

// Export validation functions
export {
  validateEmailFormat,
  validateEmailRequired,
  validateEmailLength,
  validateEmailDomain,
  validateEmailComplete,
  validateChangeEmailData,
  validateUpdateEmailData,
  EmailValidation
}

/**
 * Main Email API object untuk backward compatibility
 * Menggabungkan endpoints dan validations dalam satu interface
 */
export const EmailAPI = {
  // Endpoints
  getEmailStatus: EmailEndpoints.getStatus,
  changeEmail: EmailEndpoints.change,
  verifyEmail: EmailEndpoints.verify,
  updateEmail: EmailEndpoints.update,
  
  // Validations (untuk backward compatibility)
  validateEmailFormat: EmailValidation.format,
  validateEmailRequired: EmailValidation.required,
  validateEmailLength: EmailValidation.length,
  validateEmailDomain: EmailValidation.domain,
  validateEmailComplete: EmailValidation.complete,
  validateChangeEmailData: EmailValidation.changeEmailData,
  validateUpdateEmailData: EmailValidation.updateEmailData
}

/**
 * Contoh penggunaan:
 * 
 * // Import specific functions
 * import { getEmailStatus, validateEmailFormat } from '@/services/frontend/api/users/email'
 * 
 * // Import grouped objects
 * import { EmailEndpoints, EmailValidation } from '@/services/frontend/api/users/email'
 * 
 * // Import main API object
 * import { EmailAPI } from '@/services/frontend/api/users/email'
 * 
 * // Usage examples
 * const isValid = EmailAPI.validateEmailFormat('test@example.com')
 * const status = await EmailAPI.getEmailStatus(1)
 */