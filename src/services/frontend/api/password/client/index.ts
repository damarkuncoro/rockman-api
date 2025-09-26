/**
 * Domain: Password Client Operations
 * Responsibility: Client-side password operations aggregator
 * Design Principles: SRP, DRY, KISS
 */

// Import API untuk destructuring
import { API } from './api'

// Export API client
export { API as PasswordClientAPI } from './api'

// Export types
export type {
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  PasswordStatusResponse,
  PasswordStrengthResult,
  ApiResponse
} from '../shared/types'

// Export client functions dengan alias yang jelas
export { API } from './api'

// Convenience exports untuk backward compatibility
export const { 
  changePassword, 
  resetPassword, 
  checkPasswordStrength 
} = API