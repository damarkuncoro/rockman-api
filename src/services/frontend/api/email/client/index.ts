/**
 * Frontend Service: Email Client Module Index
 * 
 * Domain: User Management - Email Client Operations
 * Responsibility: Central export point untuk semua operasi client email
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya sebagai export aggregator untuk client
 * - DRY: Single point of import untuk client module
 * - KISS: Interface yang sederhana
 * - SOLID: Dependency inversion principle
 */

// Export semua interfaces dan types
export type {
  UpdateEmailRequest,
  UpdateEmailResponse,
  EmailStatusResponse,
  ApiResponse,
  ChangeEmailRequest,
  VerifyEmailRequest
} from './endpoint'

// Export semua endpoint functions
export {
  getEmailStatus,
  changeEmail,
  verifyEmail,
  updateEmail,
  EmailEndpoints
} from './endpoint'