/**
 * Frontend Service: Password Client API Module
 * 
 * Domain: Password Management - Client API Operations
 * Responsibility: Implementasi client-side API calls untuk password operations
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani client API operations
 * - DRY: Reusable client functions
 * - KISS: Interface yang sederhana dan jelas
 * - SOLID: Single responsibility untuk client operations
 * - RESTful: Pattern API.resource.METHOD.action untuk konsistensi
 */

import type { 
  UpdatePasswordRequest, 
  UpdatePasswordResponse, 
  PasswordStatusResponse, 
  PasswordStrengthResult 
} from '../shared/types'

/**
 * RESTful API structure untuk password operations
 * Pattern: API.password.METHOD.action
 */
export const API = {
  password: {
    /**
     * GET operations untuk password
     */
    GET: {
      /**
       * Mendapatkan status password user
       * @param userId - ID user
       * @returns Promise<PasswordStatusResponse>
       */
      status: async (userId: number): Promise<PasswordStatusResponse> => {
        const response = await fetch(`/api/users/${userId}/password/status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        return response.json()
      },

      /**
       * Check password strength menggunakan API endpoint
       * @param password - Password yang akan dicek kekuatannya
       * @returns Promise dengan hasil strength check
       */
      strength: async (
        password: string
      ): Promise<{ 
        success: boolean; 
        data?: { score: number; feedback: string[]; isValid: boolean }; 
        error?: string 
      }> => {
        try {
          const response = await fetch('/api/users/password/strength', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
          })

          const result = await response.json()
          
          if (!response.ok) {
            return {
              success: false,
              error: result.error || `HTTP error! status: ${response.status}`
            }
          }

          return {
            success: true,
            data: result.data || result
          }
        } catch (error) {
          return {
            success: false,
            error: `Terjadi kesalahan saat mengecek kekuatan password: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        }
      }
    },

    /**
     * POST operations untuk password
     */
    POST: {
      /**
       * Update password user
       * @param userId - ID user yang akan diupdate passwordnya
       * @param passwordData - Data password baru
       * @returns Promise<UpdatePasswordResponse>
       */
      update: async (
        userId: number, 
        passwordData: UpdatePasswordRequest
      ): Promise<UpdatePasswordResponse> => {
        try {
          const response = await fetch(`/api/users/${userId}/password/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(passwordData),
          })

          const result = await response.json()
          
          if (!response.ok) {
            return {
              success: false,
              error: result.error || `HTTP error! status: ${response.status}`
            }
          }

          return {
            success: true,
            message: result.message || 'Password berhasil diupdate'
          }
        } catch (error) {
          return {
            success: false,
            error: `Terjadi kesalahan saat mengupdate password: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        }
      },

      /**
       * Change password user dengan current password validation
       * @param userId - ID user yang akan diubah passwordnya
       * @param data - Data current dan new password
       * @returns Promise<UpdatePasswordResponse> - Hasil operasi change password
       */
      change: async (
        userId: number,
        data: { currentPassword: string; newPassword: string }
      ): Promise<UpdatePasswordResponse> => {
        try {
          const response = await fetch(`/api/users/${userId}/password/change`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          const result = await response.json()
          
          if (!response.ok) {
            return {
              success: false,
              error: result.error || `HTTP error! status: ${response.status}`
            }
          }

          return {
            success: true,
            message: result.message || 'Password berhasil diubah'
          }
        } catch (error) {
          return {
            success: false,
            error: `Terjadi kesalahan saat mengubah password: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        }
      },

      /**
       * Reset password menggunakan email
       * @param email - Email user yang akan direset passwordnya
       * @returns Promise<UpdatePasswordResponse> - Hasil operasi reset password
       */
      reset: async (
        email: string
      ): Promise<UpdatePasswordResponse> => {
        try {
          const response = await fetch('/api/users/password/reset', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          })

          const result = await response.json()
          
          if (!response.ok) {
            return {
              success: false,
              error: result.error || `HTTP error! status: ${response.status}`
            }
          }

          return {
            success: true,
            message: result.message || 'Reset password berhasil dikirim ke email'
          }
        } catch (error) {
          return {
            success: false,
            error: `Terjadi kesalahan saat reset password: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        }
      }
    },

    /**
     * VALIDATE operations untuk password (client-side)
     */
    VALIDATE: {
      /**
       * Validasi kekuatan password
       * @param password - Password yang akan divalidasi
       * @returns PasswordStrengthResult
       */
      strength: (password: string): PasswordStrengthResult => {
        const checks = {
          minLength: password.length >= 8,
          hasUpperCase: /[A-Z]/.test(password),
          hasLowerCase: /[a-z]/.test(password),
          hasNumbers: /\d/.test(password),
          hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        }

        const score = Object.values(checks).filter(Boolean).length
        
        return {
          ...checks,
          score,
          isStrong: score >= 4,
          strength: score >= 4 ? 'strong' : score >= 3 ? 'medium' : 'weak'
        }
      },

      /**
       * Validasi password tidak kosong
       * @param password - Password yang akan divalidasi
       * @returns boolean
       */
      required: (password: string): boolean => {
        return password.trim().length > 0
      },

      /**
       * Validasi panjang minimum password
       * @param password - Password yang akan divalidasi
       * @param minLength - Panjang minimum (default: 8)
       * @returns boolean
       */
      minLength: (password: string, minLength: number = 8): boolean => {
        return password.length >= minLength
      },

      /**
       * Validasi password match
       * @param password - Password pertama
       * @param confirmPassword - Password konfirmasi
       * @returns boolean
       */
      match: (password: string, confirmPassword: string): boolean => {
        return password === confirmPassword
      }
    },

    /**
     * UTILS operations untuk password
     */
    UTILS: {
      /**
       * Generate password strength message
       * @param password - Password yang akan dianalisis
       * @returns string
       */
      getStrengthMessage: (password: string): string => {
        const result = API.password.VALIDATE.strength(password)
        
        if (result.isStrong) {
          return 'Password kuat! Semua kriteria terpenuhi.'
        }
        
        const missing = []
        if (!result.minLength) missing.push('minimal 8 karakter')
        if (!result.hasUpperCase) missing.push('huruf besar')
        if (!result.hasLowerCase) missing.push('huruf kecil')
        if (!result.hasNumbers) missing.push('angka')
        if (!result.hasSpecialChar) missing.push('karakter khusus')
        
        return `Password ${result.strength}. Tambahkan: ${missing.join(', ')}.`
      }
    }
  },

  // Backward compatibility - deprecated methods
  getPasswordStatus: async (userId: number) => API.password.GET.status(userId),
  updatePassword: async (userId: number, passwordData: UpdatePasswordRequest) => API.password.POST.update(userId, passwordData),
  validatePasswordStrength: (password: string) => API.password.VALIDATE.strength(password),
  validatePasswordRequired: (password: string) => API.password.VALIDATE.required(password),
  validatePasswordMinLength: (password: string, minLength?: number) => API.password.VALIDATE.minLength(password, minLength),
  validatePasswordMatch: (password: string, confirmPassword: string) => API.password.VALIDATE.match(password, confirmPassword),
  getPasswordStrengthMessage: (password: string) => API.password.UTILS.getStrengthMessage(password),
  changePassword: async (userId: number, data: { currentPassword: string; newPassword: string }) => API.password.POST.change(userId, data),
  resetPassword: async (email: string) => API.password.POST.reset(email),
  checkPasswordStrength: async (password: string) => API.password.GET.strength(password)
}

/**
 * Contoh penggunaan RESTful API:
 * 
 * // GET password status
 * const passwordStatus = await API.password.GET.status(1)
 * console.log(passwordStatus.hasPassword, passwordStatus.lastUpdated)
 * 
 * // POST update password
 * const updateResult = await API.password.POST.update(1, {
 *   currentPassword: "old_password",
 *   newPassword: "new_strong_password123!"
 * })
 * console.log(updateResult.message)
 * 
 * // POST change password
 * const changeResult = await API.password.POST.change(1, {
 *   currentPassword: "old_password",
 *   newPassword: "new_strong_password123!"
 * })
 * 
 * // POST reset password
 * const resetResult = await API.password.POST.reset("user@example.com")
 * 
 * // VALIDATE password strength
 * const strength = API.password.VALIDATE.strength("MyPassword123!")
 * console.log(strength.isStrong, strength.strength) // true, "strong"
 * 
 * // GET password strength via API
 * const strengthCheck = await API.password.GET.strength("MyPassword123!")
 * console.log(strengthCheck.success, strengthCheck.data)
 * 
 * // UTILS get strength message
 * const message = API.password.UTILS.getStrengthMessage("weak")
 * console.log(message) // "Password lemah. Tambahkan: huruf besar, angka, dan karakter khusus."
 */