/**
 * Main route file untuk /api/v1/departments/[id]
 * Mengimpor dan mengekspor semua HTTP methods dari file terpisah
 * 
 * Domain: User Management - Department Management
 * Responsibility: Entry point untuk operasi departments berdasarkan ID
 */

// Import semua method dari file terpisah
export { GET } from './GET'
export { PUT } from './PUT'
export { DELETE } from './DELETE'
export { OPTIONS } from './OPTIONS'