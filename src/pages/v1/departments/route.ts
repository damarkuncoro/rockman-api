/**
 * Main route file untuk /api/v1/departments
 * Mengimpor dan mengekspor semua HTTP methods dari file terpisah
 * 
 * Domain: User Management - Department Management
 * Responsibility: Entry point untuk semua operasi departments API
 */

// Import semua method dari file terpisah
export { GET } from './GET'
export { POST } from './POST'
export { PUT } from './PUT'
export { DELETE } from './DELETE'
export { OPTIONS } from './OPTIONS'