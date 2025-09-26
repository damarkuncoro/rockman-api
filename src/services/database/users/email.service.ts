/**
 * Users Email Service
 * 
 * Domain: User Management & Communication
 * Responsibility: Mengelola operasi email khusus untuk users
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi email users
 * - DRY: Reusable email operations
 * - KISS: Interface sederhana dan jelas
 * - SOLID: Dependency injection dan interface segregation
 */

import { usersService } from './users.service'
import { SYSTEM } from '@/services/systems'
import { IServiceConfig } from '../../../core/core.interface'

/**
 * Interface untuk change email request
 */
export interface ChangeEmailRequest {
  userId: number
  currentPassword: string
  newEmail: string
}

/**
 * Interface untuk verify email request
 */
export interface VerifyEmailRequest {
  userId: number
  verificationCode: string
}

/**
 * Interface untuk email validation result
 */
export interface EmailValidationResult {
  isValid: boolean
  message: string
  data?: unknown
}

/**
 * Users Email Service Class
 * Menyediakan operasi email management untuk users
 */
export class UsersEmailService {
  private config: IServiceConfig

  /**
   * Constructor dengan konfigurasi service
   * @param config - Konfigurasi service untuk logging dan lainnya
   */
  constructor(config?: IServiceConfig) {
    this.config = config || { enableLogging: false }
  }
  
  /**
   * Mengubah email user dengan validasi password dan email format
   * @param request - Data change email request
   * @returns Promise<EmailValidationResult> - Hasil operasi change email
   */
  async changeEmail(request: ChangeEmailRequest): Promise<EmailValidationResult> {
    if (this.config.enableLogging) {
      console.log(`[UsersEmailService] Changing email for user ID: ${request.userId}`)
    }
    
    try {
      // Validasi input
      if (!request.userId || !request.currentPassword || !request.newEmail) {
        return {
          isValid: false,
          message: 'User ID, password, dan email baru wajib diisi'
        }
      }

      // Validasi format email baru
      const emailValidation = this.validateEmailFormat(request.newEmail)
      if (!emailValidation.isValid) {
        return emailValidation
      }

      // Cari user berdasarkan ID
      const user = await usersService.GET.ById(request.userId)
      if (!user) {
        return {
          isValid: false,
          message: 'User tidak ditemukan'
        }
      }

      // Verifikasi password
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isPasswordValid = await (SYSTEM as any).password.VERIFY(
        request.currentPassword, 
        user.passwordHash
      )

      if (!isPasswordValid) {
        return {
          isValid: false,
          message: 'Password tidak sesuai'
        }
      }

      // Cek apakah email sudah digunakan user lain
      const existingUser = await usersService.findByEmail(request.newEmail)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (existingUser && (existingUser as any).id !== request.userId) {
        return {
          isValid: false,
          message: 'Email sudah digunakan oleh user lain'
        }
      }

      // Update email di database
      const updatedUser = await usersService.PUT.Update(user.id, {
        email: request.newEmail
      })

      if (!updatedUser) {
        return {
          isValid: false,
          message: 'Gagal mengupdate email'
        }
      }

      return {
        isValid: true,
        message: 'Email berhasil diubah',
        data: {
          oldEmail: user.email,
          newEmail: request.newEmail
        }
      }

    } catch (error) {
      console.error('Error in changeEmail:', error)
      return {
        isValid: false,
        message: 'Terjadi kesalahan server'
      }
    }
  }

  /**
   * Validasi format email
   * @param email - Email yang akan divalidasi
   * @returns EmailValidationResult - Hasil validasi email
   */
  validateEmailFormat(email: string): EmailValidationResult {
    if (this.config.enableLogging) {
      console.log(`[UsersEmailService] Validating email format: ${email}`)
    }
    
    if (!email) {
      return {
        isValid: false,
        message: 'Email tidak boleh kosong'
      }
    }

    // Regex untuk validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        message: 'Format email tidak valid'
      }
    }

    // Validasi panjang email
    if (email.length > 254) {
      return {
        isValid: false,
        message: 'Email terlalu panjang (maksimal 254 karakter)'
      }
    }

    // Validasi domain email
    const domain = email.split('@')[1]
    if (domain.length > 253) {
      return {
        isValid: false,
        message: 'Domain email terlalu panjang'
      }
    }

    return {
      isValid: true,
      message: 'Format email valid'
    }
  }

  /**
   * Cek apakah email sudah terdaftar
   * @param email - Email yang akan dicek
   * @param excludeUserId - ID user yang dikecualikan dari pengecekan (optional)
   * @returns Promise<EmailValidationResult> - Hasil pengecekan email
   */
  async checkEmailAvailability(email: string, excludeUserId?: number): Promise<EmailValidationResult> {
    if (this.config.enableLogging) {
      console.log(`[UsersEmailService] Checking email availability: ${email}`)
    }
    
    try {
      // Validasi format email terlebih dahulu
      const formatValidation = this.validateEmailFormat(email)
      if (!formatValidation.isValid) {
        return formatValidation
      }

      // Cek apakah email sudah digunakan
      const existingUser = await usersService.findByEmail(email)
      
      if (existingUser) {
        // Jika ada excludeUserId dan email dimiliki oleh user tersebut, maka available
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (excludeUserId && (existingUser as any).id === excludeUserId) {
          return {
            isValid: true,
            message: 'Email tersedia (email saat ini)'
          }
        }

        return {
          isValid: false,
          message: 'Email sudah digunakan'
        }
      }

      return {
        isValid: true,
        message: 'Email tersedia'
      }

    } catch (error) {
      console.error('Error in checkEmailAvailability:', error)
      return {
        isValid: false,
        message: 'Terjadi kesalahan saat mengecek email'
      }
    }
  }

  /**
   * Generate verification code untuk email
   * @param length - Panjang kode verifikasi (default: 6)
   * @returns string - Kode verifikasi
   */
  generateVerificationCode(length: number = 6): string {
    if (this.config.enableLogging) {
      console.log(`[UsersEmailService] Generating verification code with length: ${length}`)
    }
    
    const characters = '0123456789'
    let result = ''
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    
    return result
  }

  /**
   * Normalize email (lowercase dan trim)
   * @param email - Email yang akan dinormalisasi
   * @returns string - Email yang sudah dinormalisasi
   */
  normalizeEmail(email: string): string {
    if (this.config.enableLogging) {
      console.log(`[UsersEmailService] Normalizing email: ${email}`)
    }
    
    return email.trim().toLowerCase()
  }

  /**
   * Extract domain dari email
   * @param email - Email yang akan diextract domainnya
   * @returns string - Domain email
   */
  extractDomain(email: string): string {
    if (this.config.enableLogging) {
      console.log(`[UsersEmailService] Extracting domain from email: ${email}`)
    }
    
    return email.split('@')[1] || ''
  }

  /**
   * Cek apakah domain email diizinkan
   * @param email - Email yang akan dicek domainnya
   * @param allowedDomains - Array domain yang diizinkan (optional)
   * @returns EmailValidationResult - Hasil validasi domain
   */
  validateEmailDomain(email: string, allowedDomains?: string[]): EmailValidationResult {
    if (this.config.enableLogging) {
      console.log(`[UsersEmailService] Validating email domain: ${email}`)
    }
    
    if (!allowedDomains || allowedDomains.length === 0) {
      return {
        isValid: true,
        message: 'Domain email valid'
      }
    }

    const domain = this.extractDomain(email)
    const isAllowed = allowedDomains.includes(domain)

    return {
      isValid: isAllowed,
      message: isAllowed ? 'Domain email valid' : `Domain ${domain} tidak diizinkan`
    }
  }
}

// Export instance untuk digunakan di aplikasi
export const usersEmailService = new UsersEmailService()

/**
 * Query Builder untuk operasi email dengan WHERE clause yang dipindahkan dari users.service.ts
 * Mengimplementasikan Fluent Interface pattern dengan integrasi ke existing email service
 */
class EmailQueryBuilder {
  private newEmail: string

  constructor(newEmail: string) {
    this.newEmail = newEmail
  }

  /**
   * WHERE clause untuk filter berdasarkan email atau ID
   */
  WHERE = {
    /**
     * WHERE clause untuk filter berdasarkan email
     * @param email - Email yang akan digunakan sebagai kondisi WHERE
     * @returns Promise hasil update email
     * 
     * @example
     * await SERVICE.email.PUT.email("new@example.com").WHERE.Email("old@example.com")
     */
    Email: async (email: string) => {
      // Validasi format email baru terlebih dahulu
      const emailValidation = usersEmailService.validateEmailFormat(this.newEmail)
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.message)
      }

      // Cari user berdasarkan email lama
      const user = await this.findUserByEmail(email)
      if (!user) {
        throw new Error(`User dengan email ${email} tidak ditemukan`)
      }

      // Cek apakah email baru sudah digunakan user lain
       const existingUser = await this.findUserByEmail(this.newEmail)
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       if (existingUser && (existingUser as any).id !== (user as any).id) {
        throw new Error(`Email ${this.newEmail} sudah digunakan`)
      }

      // Update email menggunakan repository
      const { createUsersRepository } = await import('../../../repositories/users/users.repository')
      const repository = createUsersRepository()
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedUser = await repository.UPDATE.One((user as any).id, { email: this.newEmail })
      return updatedUser
    },

    /**
     * WHERE clause untuk filter berdasarkan ID
     * @param id - ID user yang akan diupdate emailnya
     * @returns Promise hasil update email
     * 
     * @example
     * await SERVICE.email.PUT.email("new@example.com").WHERE.ID(1)
     */
    /**
     * Update email berdasarkan ID user
     * @param id - ID user yang akan diupdate
     * @returns Promise dengan hasil update
     */
    ID: async (id: number) => {
      // Validasi format email terlebih dahulu
      const emailValidation = usersEmailService.validateEmailFormat(this.newEmail)
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.message)
      }

      // Cari user berdasarkan ID
      const user = await usersService.GET.ById(id)
      if (!user) {
        throw new Error(`User dengan ID ${id} tidak ditemukan`)
      }

      // Cek apakah email sudah digunakan user lain
       const existingUser = await this.findUserByEmail(this.newEmail)
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       if (existingUser && (existingUser as any).id !== id) {
        throw new Error(`Email ${this.newEmail} sudah digunakan`)
      }

      // Update email menggunakan repository
      const { createUsersRepository } = await import('../../../repositories/users/users.repository')
      const repository = createUsersRepository()
      
      const updatedUser = await repository.UPDATE.One(id, { email: this.newEmail })
      return updatedUser
    }
  }

  /**
   * Helper method untuk mencari user berdasarkan email
   * @param email - Email yang dicari
   * @returns Promise user atau null
   */
  private async findUserByEmail(email: string) {
    // Import users service untuk mencari user
    const { usersService } = await import('./users.service')
    const user = await usersService.findByEmail(email)
    return user
  }
}

/**
 * Extended GET operations untuk email service
 */
const extendedEmailGET = {
  /**
   * Mencari user berdasarkan email
   * @param email - Email yang dicari
   * @returns Promise user atau null
   */
  email: async (email: string) => {
    // Validasi format email
    const emailService = new UsersEmailService()
    const validation = emailService.validateEmailFormat(email)
    if (!validation.isValid) {
      throw new Error(validation.message)
    }

    // Import users service untuk mencari user
    const { usersService } = await import('./users.service')
    const user = await usersService.findByEmail(email)
    
    if (!user) {
      throw new Error(`User dengan email ${email} tidak ditemukan`)
    }
    
    return user
  },

  /**
   * Alias untuk method email - mencari user berdasarkan email value
   * @param email - Email yang dicari
   * @returns Promise user atau null
   */
  value: async (email: string) => {
    // Gunakan method email yang sudah ada untuk konsistensi
    return extendedEmailGET.email(email)
  }
}

/**
 * Extended PUT operations dengan email query builder yang dipindahkan dari users.service.ts
 */
const extendedEmailPUT = {
  ...usersEmailService,
  
  /**
   * Email operation dengan query builder pattern
   * @param newEmail - Email baru yang akan diset
   * @returns EmailQueryBuilder instance untuk chaining WHERE clause
   * 
   * @example
   * // Update email berdasarkan email lama
   * await SERVICE.email.PUT.email("new@example.com").WHERE.Email("old@example.com")
   * 
   * // Update email berdasarkan ID
   * await SERVICE.email.PUT.email("new@example.com").WHERE.ID(1)
   */
  email: (newEmail: string) => {
    return new EmailQueryBuilder(newEmail)
  }
}

// Extend usersEmailService dengan email operations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(usersEmailService as any).PUT = extendedEmailPUT

/**
 * Registrasi EmailService ke SERVICE registry
 * Memungkinkan akses dengan pattern SERVICE.email.*
 * 
 * @example
 * // Email operations dengan query builder
 * await SERVICE.email.PUT.email("new@example.com").WHERE.Email("old@example.com")
 * await SERVICE.email.PUT.email("new@example.com").WHERE.ID(1)
 * 
 * // Direct email operations
 * await SERVICE.email.changeEmail({ userId: 1, currentPassword: 'pass', newEmail: 'new@example.com' })
 */
import { SERVICE } from '../../../core/core.service.registry'

// Create extended service dengan PUT operations
const extendedEmailService = {
  ...usersEmailService,
  GET: extendedEmailGET,
  PUT: extendedEmailPUT
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(SERVICE as any).register('email', extendedEmailService)

// Export default untuk compatibility
export default usersEmailService
