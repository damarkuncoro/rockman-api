// rockman-app/src/services/users.service.ts
import { Service } from '../../../core/core.service'
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
   * Method khusus untuk mencari user berdasarkan email
   * Menggunakan method khusus dari UsersRepository
   * @param email - Email user yang dicari
   * @returns Promise user atau null jika tidak ditemukan
   */
  async findByEmail(email: string) {
    if (this.config.enableLogging) {
      console.log(`[UsersService] Finding user by email: ${email}`)
    }
    
    const repository = this.repository as UsersRepository
    return await repository.findByEmail(email)
  }

  /**
   * Method khusus untuk mencari users berdasarkan department (ABAC)
   * @param department - Department yang dicari
   * @returns Promise array users dalam department tersebut
   */
  async findByDepartment(department: string) {
    if (this.config.enableLogging) {
      console.log(`[UsersService] Finding users by department: ${department}`)
    }
    
    const repository = this.repository as UsersRepository
    return await repository.findByDepartment(department)
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
 * Default instance UsersService untuk penggunaan langsung
 * Menggunakan konfigurasi dari environment variables
 */
export const usersService = createUsersService(usersServiceConfig)