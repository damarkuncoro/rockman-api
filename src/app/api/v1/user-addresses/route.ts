/**
 * API Route v1: User Addresses
 * 
 * Domain: User Management - Address Operations
 * Responsibility: Route handler untuk operasi alamat user
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya sebagai router untuk HTTP methods
 * - DRY: Centralized routing untuk semua methods
 * - KISS: Simple routing tanpa logic bisnis
 * - SOLID: Separation of concerns
 */

// Export semua HTTP methods dari file terpisah
export { GET } from './GET'
export { POST } from './POST'