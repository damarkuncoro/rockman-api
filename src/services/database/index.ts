/**
 * Database Services Index
 * 
 * Domain: Service Layer
 * Responsibility: Mengimpor dan menginisialisasi semua database services
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani import dan inisialisasi services
 * - DRY: Central point untuk semua database services
 * - KISS: Simple barrel export pattern
 */

// Import semua database services untuk memastikan registrasi ke SERVICE registry
import './users/users.service'
import './users/email.service'
import './users/password.service'
import './roles/roles.service'
import './features/features.service'
import './feature_categories/feature_categories.service'
import './policies/policies.service'
import './user_roles/user_roles.service'
import './role_features/role_features.service'
import './route_features/route_features.service'
import './access_logs/access_logs.service'
import './sessions/sessions.service'
import './change_history/change_history.service'
import './policy_violations/policy_violations.service'

// Re-export SERVICE untuk akses global
export { SERVICE } from '@/core/core.service.registry'