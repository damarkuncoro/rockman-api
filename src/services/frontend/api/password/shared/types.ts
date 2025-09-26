/**
 * Types dan interfaces untuk password API
 */

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UpdatePasswordResponse {
  success: boolean
  message?: string
  error?: string
  id?: number
  updatedAt?: string
}

export interface PasswordStatusResponse {
  id: number
  hasPassword: boolean
  lastUpdated: string
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface PasswordStrengthResult {
  minLength: boolean
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumbers: boolean
  hasSpecialChar: boolean
  score: number
  isStrong: boolean
  strength: 'weak' | 'medium' | 'strong'
}