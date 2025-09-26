/**
 * API Route v1: User Phones by ID - Route Exports
 * 
 * Domain: User Management - Phone Operations
 * Responsibility: Export semua HTTP methods untuk user phones by ID endpoints
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya mengekspor route handlers
 * - DRY: Centralized route exports
 * - KISS: Simple route configuration
 */

export { GET } from './GET'
export { PUT } from './PUT'
export { DELETE } from './DELETE'
export { PATCH } from './PATCH'