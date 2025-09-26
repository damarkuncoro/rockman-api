/**
 * Route Configuration untuk Users/[id]/Addresses API
 * 
 * Domain: User Management - Address Operations
 * Responsibility: Mengatur HTTP methods yang tersedia untuk endpoint addresses
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya mengatur routing untuk alamat user
 * - DRY: Centralized route configuration
 * - KISS: Simple route exports
 * - SOLID: Separation of concerns antara routing dan business logic
 */

/**
 * Export HTTP methods yang tersedia untuk endpoint users/[id]/addresses
 * Mendukung operasi GET dan POST untuk alamat user
 */
export { GET } from './GET'
export { POST } from './POST'