/**
 * API Route v1: User Phones - Route Exports
 * 
 * Domain: User Management - Phone Operations
 * Responsibility: Export semua HTTP methods untuk user phones endpoints
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya mengekspor route handlers
 * - DRY: Centralized route exports
 * - KISS: Simple route configuration
 */

export { GET } from './GET'
export { POST } from './POST'
export { PUT } from './PUT'
export { DELETE } from './DELETE'
export { OPTIONS } from './OPTIONS'