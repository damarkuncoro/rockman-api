/**
 * Frontend Service: Users Types Module
 * 
 * Domain: User Management - Type Definitions
 * Responsibility: Definisi types untuk users API operations
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani type definitions
 * - DRY: Centralized types untuk reusability
 * - KISS: Interface yang sederhana dan jelas
 */

/**
 * Request untuk update password user
 */
export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

/**
 * Response dari update password operation
 */
export interface UpdatePasswordResponse {
  success: boolean
  message?: string
  error?: string
}

/**
 * Response untuk status password user
 */
export interface PasswordStatusResponse {
  hasPassword: boolean
  lastChanged?: string
  strength?: {
    score: number
    feedback: string[]
  }
}

/**
 * User profile data interface
 */
export interface UserProfileData {
  id?: number
  name?: string
  email?: string
  avatar?: string
  bio?: string
  phone?: string
  location?: string
  website?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Extended user data interface untuk detail view
 * Mencakup semua properti yang dibutuhkan untuk tampilan detail user
 */
export interface UserDetailData {
  id: number
  name: string
  email: string
  active?: boolean | null
  departmentId?: number | null
  region?: string | null
  level?: number | null
  rolesUpdatedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/**
 * Result dari password strength validation
 */
export interface PasswordStrengthResult {
  score: number
  feedback: string[]
  isStrong: boolean
}