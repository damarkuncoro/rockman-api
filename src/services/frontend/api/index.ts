/**
 * Frontend API Services Index
 * 
 * Domain: Frontend API Layer
 * Responsibility: Mengekspor semua API services untuk frontend consumption
 * 
 * Mengikuti prinsip:
 * - DRY: Centralized export untuk semua API services
 * - KISS: Simple barrel export pattern
 * - SOLID: Single responsibility untuk API service exports
 * 
 * @example
 * // Import semua API services
 * import { API } from '@/services/frontend/api'
 * 
 * // Gunakan API services
 * const users = await API.users.GET.all()
 * const user = await API.users.GET.byId(1)
 * 
 * // Custom methods
 * const emailResult = await API.users.changeEmail(1, {
 *   currentPassword: 'current',
 *   newEmail: 'new@example.com'
 * })
 */

// Import API services dari masing-masing module
import { API as UsersAPI } from './users'

/**
 * Centralized API object yang mengekspor semua API services
 * Memungkinkan akses yang konsisten ke semua API endpoints
 * 
 * @example
 * // Import dan gunakan
 * import { API } from '@/services/frontend/api'
 * 
 * // Users operations
 * const allUsers = await API.users.GET.all()
 * const user = await API.users.GET.byId(1)
 * const newUser = await API.users.POST.create({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   passwordHash: 'hashed_password'
 * })
 * 
 * // Custom operations
 * const changeEmailResult = await API.users.changeEmail(1, {
 *   currentPassword: 'current_password',
 *   newEmail: 'new@example.com'
 * })
 */
export const API = {
  /**
   * Users API service dengan CRUD operations dan custom methods
   * Menyediakan interface untuk semua operasi user management
   */
  users: UsersAPI.users,
}

/**
 * Export individual API services untuk flexibility
 * Memungkinkan import specific service jika diperlukan
 */
export { API as UsersAPI } from './users'

/**
 * Export types untuk TypeScript support
 */
export type { ChangeEmailRequest, VerifyEmailRequest } from './users'

/**
 * Re-export core API utilities untuk convenience
 */
export { fetcher, resources } from '@/core/core.api'