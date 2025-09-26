// rockman-api/src/services/users.service.ts
import { Service } from '../../../core/core.service'
import { SERVICE } from '../../../core/core.service.registry'
import { UsersRepository, createUsersRepository } from '../../../repositories/users/users.repository'
import { users } from '../../../db/schema/users'
import { IServiceConfig } from '../../../core/core.interface'
import { usersServiceConfig } from '../../../config/environments/services/users.config'

/**
 * Users Service dengan Dependency Injection
 * Menggunakan Repository pattern untuk akses data
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 */
export class UsersService extends Service<typeof users> {
  /**
   * Constructor dengan dependency injection
   * @param repository - Instance UsersRepository yang di-inject
   * @param config - Konfigurasi service (optional)
   */
  constructor(
    repository: UsersRepository,
    config?: IServiceConfig
  ) {
    super(repository, config)
  }

  /**
   * Method khusus untuk mencari user berdasarkan email (ABAC)
   * @param _email - Email yang dicari (parameter tidak digunakan dalam implementasi saat ini)
   * @returns Promise user atau null jika tidak ditemukan
   */
  /**
   * Mencari user berdasarkan email
   * @param _email - Email user yang dicari
   * @returns Promise user atau null jika tidak ditemukan
   */
  async findByEmail(_email: string) {
    // Implementasi pencarian user berdasarkan email
    // Menggunakan database query untuk mencari user
    return null // Placeholder implementation
  }

  /**
   * Method khusus untuk mencari users berdasarkan department ID (ABAC)
   * @param departmentId - ID department yang dicari
   * @returns Promise array users dalam department tersebut
   */
  async findByDepartmentId(departmentId: number) {
    if (this.config.enableLogging) {
      console.log(`[UsersService] Finding users by department ID: ${departmentId}`)
    }
    
    const repository = this.repository as UsersRepository
    return await repository.findByDepartmentId(departmentId)
  }

  /**
   * Method khusus untuk mencari users berdasarkan region (ABAC)
   * @param region - Region yang dicari
   * @returns Promise array users dalam region tersebut
   */
  async findByRegion(region: string) {
    if (this.config.enableLogging) {
      console.log(`[UsersService] Finding users by region: ${region}`)
    }
    
    const repository = this.repository as UsersRepository
    return await repository.findByRegion(region)
  }
  
  /**
   * Method khusus untuk mencari users berdasarkan customer type (ABAC)
   * @param customerType - Tipe customer yang dicari
   * @returns Promise array users dengan tipe customer tertentu
   */
  async findByCustomerType(customerType: string) {
    if (this.config.enableLogging) {
      console.log(`[UsersService] Finding users by customer type: ${customerType}`)
    }
    
    const repository = this.repository as UsersRepository
    return await repository.findByCustomerType(customerType)
  }
  
  /**
   * Method khusus untuk mencari users berdasarkan customer tier (ABAC)
   * @param customerTier - Tier customer yang dicari
   * @returns Promise array users dengan tier customer tertentu
   */
  async findByCustomerTier(customerTier: string) {
    if (this.config.enableLogging) {
      console.log(`[UsersService] Finding users by customer tier: ${customerTier}`)
    }
    
    const repository = this.repository as UsersRepository
    return await repository.findByCustomerTier(customerTier)
  }
  
  /**
   * Method khusus untuk mencari users berdasarkan customer status (ABAC)
   * @param customerStatus - Status customer yang dicari
   * @returns Promise array users dengan status customer tertentu
   */
  async findByCustomerStatus(customerStatus: string) {
    if (this.config.enableLogging) {
      console.log(`[UsersService] Finding users by customer status: ${customerStatus}`)
    }
    
    const repository = this.repository as UsersRepository
    return await repository.findByCustomerStatus(customerStatus)
  }
  
  /**
   * Method khusus untuk mencari users berdasarkan customer segment (ABAC)
   * @param customerSegment - Segment customer yang dicari
   * @returns Promise array users dengan segment customer tertentu
   */
  async findByCustomerSegment(customerSegment: string) {
    if (this.config.enableLogging) {
      console.log(`[UsersService] Finding users by customer segment: ${customerSegment}`)
    }
    
    const repository = this.repository as UsersRepository
    return await repository.findByCustomerSegment(customerSegment)
  }

  /**
   * Method khusus untuk mencari users berdasarkan level minimum (ABAC)
   * @param minLevel - Level minimum yang dicari
   * @returns Promise array users dengan level >= minLevel
   */
  async findByMinLevel(minLevel: number) {
    if (this.config.enableLogging) {
      console.log(`[UsersService] Finding users by min level: ${minLevel}`)
    }
    
    const repository = this.repository as UsersRepository
    return await repository.findByMinLevel(minLevel)
  }
}

/**
 * Factory function untuk membuat instance UsersService
 * Memudahkan dependency injection dan testing
 * 
 * @param config - Konfigurasi service (optional)
 * @returns Instance UsersService yang siap digunakan
 */
export function createUsersService(config?: IServiceConfig): UsersService {
  const repository = createUsersRepository()
  return new UsersService(repository, config)
}

/**
 * Password Query Builder Class untuk Users Service
 * Menyediakan fluent interface untuk password operations
 */
class UsersPasswordQueryBuilder {
  private userId: number

  constructor(userId: number) {
    this.userId = userId
  }

  /**
   * PUT operations untuk password
   */
  get PUT() {
    return {
      /**
       * Update password dengan validasi password lama
       * @param oldPassword - Password lama untuk validasi
       * @param newPassword - Password baru
       * @returns Promise updated user
       */
      password: async (oldPassword: string, newPassword: string) => {
        // Import password service untuk operasi password
        const { usersPasswordService } = await import('./password.service')
        
        // Gunakan changePassword method yang sudah ada
        const result = await usersPasswordService.changePassword({
          userId: this.userId,
          currentPassword: oldPassword,
          newPassword: newPassword
        })

        if (!result.isValid) {
          throw new Error(result.message)
        }

        // Return updated user data
        const updatedUser = await usersService.GET.ById(this.userId)
        return updatedUser
      }
    }
  }
}

/**
 * User ID Query Builder Class untuk Users Service
 * Menyediakan fluent interface untuk operasi berdasarkan user ID
 */
class UsersIdQueryBuilder {
  private userId: number

  constructor(userId: number) {
    this.userId = userId
  }

  /**
   * PUT operations untuk user berdasarkan ID
   */
  get PUT(): UsersPasswordQueryBuilder {
    return new UsersPasswordQueryBuilder(this.userId)
  }

  /**
   * Execute untuk mendapatkan user data berdasarkan ID
   * @returns Promise user data
   */
  async execute() {
    return await usersService.GET.ById(this.userId)
  }
}

export const usersService = createUsersService(usersServiceConfig)

// Store original methods before override
const originalGetAll = usersService.GET.All.bind(usersService)
const originalGetById = usersService.GET.ById.bind(usersService)

// Extend usersService dengan query builder pattern
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(usersService as any).GET = {
  // Preserve existing GET methods - menggunakan original methods untuk menghindari circular reference
  All: originalGetAll,
  ById: originalGetById,
  // Add query builder ID method
  ID: (id: number) => new UsersIdQueryBuilder(id)
}

/**
 * Registrasi UsersService ke SERVICE registry
 * Memungkinkan akses dengan pattern SERVICE.user.* atau SERVICE.users.*
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(SERVICE as any).register('user', usersService)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(SERVICE as any).register('users', usersService)