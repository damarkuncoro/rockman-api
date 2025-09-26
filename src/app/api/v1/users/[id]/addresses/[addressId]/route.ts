/**
 * Route Configuration untuk Users/[id]/Addresses/[addressId] API
 * 
 * Domain: User Management - Address Operations by ID
 * Responsibility: Mengatur HTTP methods yang tersedia untuk endpoint address by ID
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya mengatur routing untuk alamat user by ID
 * - DRY: Centralized route configuration
 * - KISS: Simple route exports
 * - SOLID: Separation of concerns antara routing dan business logic
 */

/**
 * Export HTTP methods yang tersedia untuk endpoint users/[id]/addresses/[addressId]
 * Mendukung operasi update, delete, dan patch untuk alamat user berdasarkan ID
 */
export { PUT } from './PUT'
export { DELETE } from './DELETE'
export { PATCH } from './PATCH'