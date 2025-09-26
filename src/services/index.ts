// rockman-api/src/services/index.ts

/**
 * Services Index - Central Export Point
 * 
 * Domain: Service Layer
 * Responsibility: Mengimpor semua services dan mengekspor SERVICE registry
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani import/export services
 * - DRY: Single point untuk akses semua services
 * - KISS: Simple barrel export dengan auto-registration
 * - SOLID: Dependency management yang terorganisir
 * 
 * @example
 * // Import SERVICE registry
 * import { SERVICE } from '@/services'
 * 
 * // Gunakan services
 * const users = await SERVICE.user.GET.All()
 * const user = await SERVICE.user.GET.ById(123)
 */

// Import SERVICE registry
import { SERVICE } from '../core/core.service.registry'

// Import semua database services untuk auto-registration
import './database/users/users.service'
import './database/users/email.service'
import './database/users/password.service'
import './database/user_roles/user_roles.service'
import './database/roles/roles.service'
import './database/features/features.service'
import './database/role_features/role_features.service'
import './database/route_features/route_features.service'
import './database/sessions/sessions.service'
import './database/access_logs/access_logs.service'
import './database/policies/policies.service'
import './database/policy_violations/policy_violations.service'
import './database/change_history/change_history.service'

// Import semua system services
import './systems'

/**
 * Re-export SERVICE registry untuk akses global
 * Semua services sudah terdaftar otomatis saat import
 * 
 * @example
 * // Akses users service
 * const users = await SERVICE.user.GET.All()
 * 
 * // Akses roles service
 * const roles = await SERVICE.role.GET.All()
 * 
 * // Akses features service
 * const features = await SERVICE.feature.GET.All()
 */
export { SERVICE }

/**
 * Re-export default untuk compatibility
 */
export default SERVICE

/**
 * Type imports untuk TypeScript support
 */
import type { IServiceRegistry, ServiceRegistration } from '../core/core.service.registry'

/**
 * Development helper - Log registered services
 * Hanya aktif di development mode
 */
if (process.env.NODE_ENV === 'development') {
  console.log('[Services Index] Registered services:', SERVICE.list())
  console.log('[Services Index] Total services:', SERVICE.stats().total)
}

/**
 * Type exports untuk TypeScript support
 */
export type { IServiceRegistry, ServiceRegistration }