/**
 * Users Password Service
 * 
 * Domain: Authentication & Security
 * Responsibility: Mengelola operasi password khusus untuk users
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi password users
 * - DRY: Reusable password operations
 * - KISS: Interface sederhana dan jelas
 * - SOLID: Dependency injection dan interface segregation
 */

import { usersService } from './users.service'
import { processPasswordInData, hasValidPassword, generateRandomPassword } from '@/utils/password.utils'
import { SYSTEM } from '@/services/systems'
import { IServiceConfig } from '../../../core/core.interface'

/**
 * Interface untuk change password request
 */
export interface ChangePasswordRequest {
  userId: number
  currentPassword: string
  newPassword: string
}

/**
 * Interface untuk reset password request
 */
export interface ResetPasswordRequest {
  email: string
}

/**
 * Interface untuk password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean
  message: string
}

/**
 * Users Password Service Class
 * Menyediakan operasi password management untuk users
 */
export class UsersPasswordService {
  private config: IServiceConfig

  /**
   * Constructor untuk UsersPasswordService
   * @param config - Konfigurasi service (optional)
   */
  constructor(config?: IServiceConfig) {
    this.config = config || { enableLogging: false }
  }
  
  /**
   * Mengubah password user dengan validasi password lama
   * @param request - Data change password request
   * @returns Promise<PasswordValidationResult> - Hasil operasi change password
   */
  async changePassword(request: ChangePasswordRequest): Promise<PasswordValidationResult> {
    if (this.config.enableLogging) {
      console.log(`[UsersPasswordService] Changing password for user ID: ${request.userId}`)
    }
    
    try {
      // Validasi input
      if (!request.userId || !request.currentPassword || !request.newPassword) {
        return {
          isValid: false,
          message: 'User ID, password lama, dan password baru wajib diisi'
        }
      }

      // Cari user berdasarkan ID
      const user = await usersService.GET.ById(request.userId)
      if (!user) {
        return {
          isValid: false,
          message: 'User tidak ditemukan'
        }
      }

      // Verifikasi password lama
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isCurrentPasswordValid = await (SYSTEM as any).password.VERIFY(
        request.currentPassword, 
        user.passwordHash
      )

      if (!isCurrentPasswordValid) {
        return {
          isValid: false,
          message: 'Password lama tidak sesuai'
        }
      }

      // Validasi password baru
      if (!hasValidPassword({ password: request.newPassword })) {
        return {
          isValid: false,
          message: 'Password baru tidak memenuhi kriteria keamanan'
        }
      }

      // Process password baru dengan hashing
      const processedData = await processPasswordInData({ password: request.newPassword })

      // Update password di database
      const updatedUser = await usersService.PUT.Update(user.id, {
        passwordHash: processedData.password
      })

      if (!updatedUser) {
        return {
          isValid: false,
          message: 'Gagal mengupdate password'
        }
      }

      return {
        isValid: true,
        message: 'Password berhasil diubah'
      }

    } catch (error) {
      console.error('Error in changePassword:', error)
      return {
        isValid: false,
        message: 'Terjadi kesalahan server'
      }
    }
  }

  /**
   * Reset password user berdasarkan email
   * @param request - Data reset password request
   * @returns Promise<PasswordValidationResult> - Hasil operasi reset password
   */
  async resetPassword(request: ResetPasswordRequest): Promise<PasswordValidationResult> {
    if (this.config.enableLogging) {
      console.log(`[UsersPasswordService] Resetting password for email: ${request.email}`)
    }
    
    try {
      // Validasi input
      if (!request.email) {
        return {
          isValid: false,
          message: 'Email wajib diisi'
        }
      }

      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(request.email)) {
        return {
          isValid: false,
          message: 'Format email tidak valid'
        }
      }

      // Cari user berdasarkan email
      const users = await usersService.GET.All()
      const user = users.find(u => u.email === request.email)

      // Jika user tidak ditemukan, tetap return success untuk security
      if (!user) {
        return {
          isValid: true,
          message: 'Jika email terdaftar, instruksi reset password akan dikirim'
        }
      }

      // Generate password baru menggunakan utility
      const newPassword = generateRandomPassword(12)

      // Validasi password baru
      if (!hasValidPassword({ password: newPassword })) {
        return {
          isValid: false,
          message: 'Gagal generate password yang valid'
        }
      }

      // Process password dengan hashing
      const processedData = await processPasswordInData({ password: newPassword })

      // Update password user
      const updatedUser = await usersService.PUT.Update(user.id, {
        passwordHash: processedData.password
      })

      if (!updatedUser) {
        return {
          isValid: false,
          message: 'Gagal mengupdate password'
        }
      }

      // TODO: Implementasi pengiriman email dengan password baru
      // Untuk development, log password baru (JANGAN LAKUKAN DI PRODUCTION!)
      if (process.env.NODE_ENV === 'development') {
        console.log(`New password for ${request.email}: ${newPassword}`)
      }

      return {
        isValid: true,
        message: 'Jika email terdaftar, instruksi reset password akan dikirim'
      }

    } catch (error) {
      console.error('Error in resetPassword:', error)
      return {
        isValid: false,
        message: 'Terjadi kesalahan server'
      }
    }
  }

  /**
   * Validasi kekuatan password
   * @param password - Password yang akan divalidasi
   * @returns PasswordValidationResult - Hasil validasi password
   */
  validatePasswordStrength(password: string): PasswordValidationResult {
    if (this.config.enableLogging) {
      console.log(`[UsersPasswordService] Validating password strength`)
    }
    
    if (!password) {
      return {
        isValid: false,
        message: 'Password tidak boleh kosong'
      }
    }

    if (password.length < 8) {
      return {
        isValid: false,
        message: 'Password minimal 8 karakter'
      }
    }

    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password harus mengandung minimal 1 huruf kecil'
      }
    }

    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password harus mengandung minimal 1 huruf besar'
      }
    }

    if (!/[0-9]/.test(password)) {
      return {
        isValid: false,
        message: 'Password harus mengandung minimal 1 angka'
      }
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return {
        isValid: false,
        message: 'Password harus mengandung minimal 1 karakter khusus'
      }
    }

    return {
      isValid: true,
      message: 'Password memenuhi kriteria keamanan'
    }
  }

  /**
   * Generate password baru dengan strength tertentu
   * @param strength - Level kekuatan password ('weak' | 'medium' | 'strong')
   * @returns string - Password yang di-generate
   */
  generateNewPassword(strength: 'weak' | 'medium' | 'strong' = 'medium'): string {
    if (this.config.enableLogging) {
      console.log(`[UsersPasswordService] Generating new password with strength: ${strength}`)
    }
    
    const lengthMap = {
      weak: 6,
      medium: 8,
      strong: 12
    }

    return generateRandomPassword(lengthMap[strength])
  }

  /**
   * Verifikasi password dengan hash yang tersimpan
   * @param plainPassword - Password plain text
   * @param hashedPassword - Password yang sudah di-hash
   * @returns Promise<boolean> - True jika password cocok
   */
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    if (this.config.enableLogging) {
      console.log(`[UsersPasswordService] Verifying password`)
    }
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (SYSTEM as any).password.VERIFY(plainPassword, hashedPassword)
    } catch (error) {
      console.error('Error in verifyPassword:', error)
      return false
    }
  }

  /**
   * Hash password menggunakan bcrypt
   * @param plainPassword - Password plain text
   * @returns Promise<string> - Password yang sudah di-hash
   */
  async hashPassword(plainPassword: string): Promise<string> {
    if (this.config.enableLogging) {
      console.log(`[UsersPasswordService] Hashing password`)
    }
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (SYSTEM as any).password.GENERATE(plainPassword)
    } catch (error) {
      console.error('Error in hashPassword:', error)
      throw new Error('Gagal melakukan hash password')
    }
  }
}

/**
 * Password Query Builder Class
 * Menyediakan fluent interface untuk update password operations
 */
class PasswordQueryBuilder {
  private newPassword: string

  constructor(newPassword: string) {
    this.newPassword = newPassword
  }

  /**
   * WHERE clause untuk query builder pattern
   */
  WHERE = {
    /**
     * Update password berdasarkan user ID
     * @param id - ID user yang akan diupdate passwordnya
     * @returns Promise updated user
     */
    ID: async (id: number) => {
      // Validasi input
      if (!id || id <= 0) {
        throw new Error('User ID harus berupa angka positif')
      }

      if (!this.newPassword || this.newPassword.trim() === '') {
        throw new Error('Password baru wajib diisi')
      }

      // Validasi kekuatan password
      const passwordService = new UsersPasswordService()
      const validation = passwordService.validatePasswordStrength(this.newPassword)
      if (!validation.isValid) {
        throw new Error(validation.message)
      }

      // Hash password baru
      const hashedPassword = await passwordService.hashPassword(this.newPassword)

      // Update password menggunakan repository
      const { createUsersRepository } = await import('../../../repositories/users/users.repository')
      const repository = createUsersRepository()
      
      const updatedUser = await repository.UPDATE.One(id, { passwordHash: hashedPassword })
      return updatedUser
    }
  }

  /**
   * Execute method untuk menjalankan query
   * @returns Promise dengan hasil operasi
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(): Promise<any> {
    throw new Error('Execute method harus dipanggil setelah WHERE clause')
  }
}

// Export instance untuk digunakan di aplikasi
export const usersPasswordService = new UsersPasswordService()

/**
 * Extended PUT operations untuk password service
 */
const extendedPasswordPUT = {
  /**
   * Update password dengan query builder pattern
   * @param newPassword - Password baru
   * @returns PasswordQueryBuilder instance
   */
  password: (newPassword: string) => {
    return new PasswordQueryBuilder(newPassword)
  }
}

/**
 * Extended POST operations untuk password service
 */
const extendedPasswordPOST = {
  /**
   * Validasi kekuatan password dengan POST pattern
   * @param password - Password yang akan divalidasi
   * @returns PasswordValidationResult - Hasil validasi password
   * 
   * @example
   * const result = (SERVICE as any).password.POST.strength("myPassword123!")
   * if (result.isValid) {
   *   console.log("Password valid")
   * }
   */
  strength: (password: string): PasswordValidationResult => {
    return usersPasswordService.validatePasswordStrength(password)
  },

  /**
   * Hash password dengan POST pattern
   * @param password - Password plain text yang akan di-hash
   * @returns Promise<string> - Password yang sudah di-hash
   * 
   * @example
   * const hashedPassword = await (SERVICE as any).password.POST.hash("myPassword123!")
   * console.log("Hashed password:", hashedPassword)
   */
  hash: async (password: string): Promise<string> => {
    return await usersPasswordService.hashPassword(password)
  }
}

// Tambahkan PUT dan POST operations ke service instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(usersPasswordService as any).PUT = extendedPasswordPUT
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(usersPasswordService as any).POST = extendedPasswordPOST

// Import dan register ke SERVICE registry
import { SERVICE } from '../../../core/core.service.registry'

const extendedPasswordService = {
  ...usersPasswordService,
  PUT: extendedPasswordPUT,
  POST: extendedPasswordPOST
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(SERVICE as any).register('password', extendedPasswordService)

// Export default untuk compatibility
export default usersPasswordService

