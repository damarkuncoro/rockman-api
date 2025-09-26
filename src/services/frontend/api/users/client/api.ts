/**
 * Users Client API
 * 
 * Menyediakan interface untuk operasi users dengan REST-like pattern.
 * Menggunakan nested objects untuk mengorganisir endpoints berdasarkan HTTP methods.
 * 
 * Struktur:
 * - API.users.GET.* - untuk retrieve data users
 * - API.users.POST.* - untuk create/update data users
 * - Password operations di-delegate ke Password API (DRY principle)
 * 
 * Features:
 * - Client-side validation
 * - Error handling yang konsisten
 * - Separation of concerns dengan Password API
 * - Backward compatibility dengan method lama
 * 
 * Contoh penggunaan:
 * ```typescript
 * // REST pattern (recommended)
 * const profile = await API.users.GET.profile(userId)
 * const result = await API.users.POST.updateProfile(userId, profileData)
 * 
 * // Password operations (delegated to Password API)
 * const status = await API.users.password.GET.status(userId)
 * const result = await API.users.password.POST.update(userId, passwordData)
 * 
 * // Backward compatibility (deprecated)
 * const status = await API.getPasswordStatus(userId)
 * const result = await API.updatePassword(userId, passwordData)
 * ```
 */

import type { 
  ApiResponse,
  UserProfileData
} from '../shared/types'

// Import Password API untuk menghindari duplikasi (DRY principle)
import { API as PasswordAPI } from '../../password/client/api'
import type { UpdatePasswordRequest } from '../../password/shared/types'

/**
 * RESTful API structure untuk users operations
 * Pattern: API.users.METHOD.action
 */
export const API = {
  users: {
    /**
     * GET operations untuk users
     */
    GET: {
      /**
       * Mendapatkan profil user
       * @param userId - ID user yang akan diambil profilnya
       * @returns Promise<ApiResponse<UserProfileData>> - Data profil user
       */
      profile: async (userId: number): Promise<ApiResponse<UserProfileData>> => {
        try {
          const response = await fetch(`/api/users/${userId}/profile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          return response.json()
        } catch (error) {
          throw new Error(`Gagal mendapatkan profil user: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    },

    /**
     * POST operations untuk users
     */
    POST: {
      /**
       * Update profil user
       * @param userId - ID user yang akan diupdate profilnya
       * @param profileData - Data profil baru
       * @returns Promise<ApiResponse<UserProfileData>> - Hasil update profil
       */
      updateProfile: async (
        userId: number,
        profileData: Partial<UserProfileData>
      ): Promise<ApiResponse<UserProfileData>> => {
        try {
          const response = await fetch(`/api/users/${userId}/profile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
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
            data: result.data,
            message: result.message || 'Profil berhasil diupdate'
          }
        } catch (error) {
          return {
            success: false,
            error: `Terjadi kesalahan saat mengupdate profil: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        }
      }
    },

    /**
     * Password operations - delegated ke Password API (DRY principle)
     * Menghindari duplikasi dengan menggunakan Password API sebagai single source of truth
     */
    password: PasswordAPI.password
  },

  // Backward compatibility methods (deprecated)
  // @deprecated Gunakan API.users.password.GET.status() sebagai gantinya
  getPasswordStatus: async (userId: number) => PasswordAPI.password.GET.status(userId),
  
  // @deprecated Gunakan API.users.password.POST.update() sebagai gantinya  
  updatePassword: async (userId: number, passwordData: UpdatePasswordRequest) => PasswordAPI.password.POST.update(userId, passwordData)
}

/**
 * Contoh penggunaan RESTful API:
 * 
 * // GET password status
 * const passwordStatus = await API.users.GET.passwordStatus(1)
 * console.log(passwordStatus.hasPassword, passwordStatus.lastUpdated)
 * 
 * // GET user profile
 * const profile = await API.users.GET.profile(1)
 * console.log(profile.data)
 * 
 * // POST update password
 * const updateResult = await API.users.POST.updatePassword(1, {
 *   currentPassword: "old_password",
 *   newPassword: "new_strong_password123!"
 * })
 * console.log(updateResult.message)
 * 
 * // POST update profile
 * const profileResult = await API.users.POST.updateProfile(1, {
 *   name: "John Doe",
 *   email: "john@example.com"
 * })
 * console.log(profileResult.message)
 */

// Export individual functions untuk backward compatibility
export const updatePassword = API.updatePassword
export const getPasswordStatus = API.getPasswordStatus