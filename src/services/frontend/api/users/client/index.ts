/**
 * Frontend Service: Users Client Module Index
 * 
 * Domain: User Management - Client Operations
 * Responsibility: Central export point untuk semua operasi client users
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya sebagai export aggregator untuk client
 * - DRY: Single point of import untuk client module
 * - KISS: Interface yang sederhana
 * - SOLID: Dependency inversion principle
 */

// Export query builder functions dan classes
export {
  createUsersQueryBuilder,
  UsersQueryBuilder
} from './query-builder'

// Export types dari query builder
export type {
  EmailUpdateResponse
} from './query-builder'

// Export client API functions
export { API, updatePassword } from './api'