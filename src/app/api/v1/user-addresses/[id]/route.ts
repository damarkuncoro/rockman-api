/**
 * API Route v1: User Addresses by ID
 * 
 * Domain: User Management - Address Operations
 * Responsibility: Route handler untuk operasi alamat user berdasarkan ID
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya sebagai router untuk HTTP methods
 * - DRY: Centralized routing untuk semua methods
 * - KISS: Simple routing tanpa logic bisnis
 * - SOLID: Separation of concerns
 */

// Export semua HTTP methods dari file terpisah
export { GET } from './GET'
export { PUT } from './PUT'
export { DELETE } from './DELETE'
export { PATCH } from './PATCH'