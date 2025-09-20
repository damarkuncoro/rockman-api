// rockman-app/src/services/user_roles/user_roles.service.ts
import { Service } from '../../../core/core.service'
import { UserRolesRepository, createUserRolesRepository } from '../../../repositories/user_roles/user_roles.repository'
import { userRoles } from '../../../db/schema/user_roles'
import { IServiceConfig } from '../../../core/core.interface'

/**
 * User Roles Service dengan Dependency Injection
 * Menggunakan Repository pattern untuk akses data
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 */
export class UserRolesService extends Service<typeof userRoles> {
  /**
   * Constructor dengan dependency injection
   * @param repository - Instance UserRolesRepository yang di-inject
   * @param config - Konfigurasi service (optional)
   */
  constructor(
    repository: UserRolesRepository,
    config?: IServiceConfig
  ) {
    super(repository, config)
  }

  /**
   * Method khusus untuk mencari user roles berdasarkan user ID
   * @param userId - ID user yang dicari
   * @returns Promise array user roles untuk user tersebut
   */
  async findByUserId(userId: number) {
    if (this.config.enableLogging) {
      console.log(`[UserRolesService] Finding user roles by user ID: ${userId}`)
    }
    
    const repository = this.repository as UserRolesRepository
    return await repository.findByUserId(userId)
  }

  /**
   * Method khusus untuk mencari user roles berdasarkan role ID
   * @param roleId - ID role yang dicari
   * @returns Promise array user roles untuk role tersebut
   */
  async findByRoleId(roleId: number) {
    if (this.config.enableLogging) {
      console.log(`[UserRolesService] Finding user roles by role ID: ${roleId}`)
    }
    
    const repository = this.repository as UserRolesRepository
    return await repository.findByRoleId(roleId)
  }

  /**
   * Method khusus untuk mencari user role berdasarkan user dan role
   * @param userId - ID user
   * @param roleId - ID role
   * @returns Promise user role atau null jika tidak ditemukan
   */
  async findByUserAndRole(userId: number, roleId: number) {
    if (this.config.enableLogging) {
      console.log(`[UserRolesService] Finding user role by user ID: ${userId} and role ID: ${roleId}`)
    }
    
    const repository = this.repository as UserRolesRepository
    return await repository.findByUserAndRole(userId, roleId)
  }

  /**
   * Method khusus untuk mendapatkan role IDs berdasarkan user
   * @param userId - ID user yang dicari
   * @returns Promise array role IDs untuk user tersebut
   */
  async getRoleIdsByUser(userId: number): Promise<number[]> {
    if (this.config.enableLogging) {
      console.log(`[UserRolesService] Getting role IDs by user ID: ${userId}`)
    }
    
    const repository = this.repository as UserRolesRepository
    return await repository.getRoleIdsByUser(userId)
  }

  /**
   * Method khusus untuk mendapatkan user IDs berdasarkan role
   * @param roleId - ID role yang dicari
   * @returns Promise array user IDs untuk role tersebut
   */
  async getUserIdsByRole(roleId: number): Promise<number[]> {
    if (this.config.enableLogging) {
      console.log(`[UserRolesService] Getting user IDs by role ID: ${roleId}`)
    }
    
    const repository = this.repository as UserRolesRepository
    return await repository.getUserIdsByRole(roleId)
  }

  /**
   * Method khusus untuk mencari user roles berdasarkan array user IDs
   * @param userIds - Array ID users yang dicari
   * @returns Promise array user roles untuk users tersebut
   */
  async findByUserIds(userIds: number[]) {
    if (this.config.enableLogging) {
      console.log(`[UserRolesService] Finding user roles by user IDs: ${userIds.join(', ')}`)
    }
    
    const repository = this.repository as UserRolesRepository
    return await repository.findByUserIds(userIds)
  }

  /**
   * Method khusus untuk mengecek apakah user memiliki role tertentu
   * @param userId - ID user yang dicek
   * @param roleId - ID role yang dicek
   * @returns Promise boolean apakah user memiliki role tersebut
   */
  async hasUserRole(userId: number, roleId: number): Promise<boolean> {
    if (this.config.enableLogging) {
      console.log(`[UserRolesService] Checking if user ${userId} has role ${roleId}`)
    }
    
    const repository = this.repository as UserRolesRepository
    return await repository.hasUserRole(userId, roleId)
  }

  /**
   * Method khusus untuk menghitung users berdasarkan role
   * @param roleId - ID role yang dicari
   * @returns Promise jumlah users untuk role tersebut
   */
  async countUsersByRole(roleId: number): Promise<number> {
    if (this.config.enableLogging) {
      console.log(`[UserRolesService] Counting users by role ID: ${roleId}`)
    }
    
    const repository = this.repository as UserRolesRepository
    return await repository.countUsersByRole(roleId)
  }

  /**
   * Method khusus untuk menghitung roles berdasarkan user
   * @param userId - ID user yang dicari
   * @returns Promise jumlah roles untuk user tersebut
   */
  async countRolesByUser(userId: number): Promise<number> {
    if (this.config.enableLogging) {
      console.log(`[UserRolesService] Counting roles by user ID: ${userId}`)
    }
    
    const repository = this.repository as UserRolesRepository
    return await repository.countRolesByUser(userId)
  }
}

/**
 * Factory function untuk membuat instance UserRolesService
 * Memudahkan dependency injection dan testing
 * 
 * @param config - Konfigurasi service (optional)
 * @returns Instance UserRolesService yang siap digunakan
 */
export function createUserRolesService(config?: IServiceConfig): UserRolesService {
  const repository = createUserRolesRepository()
  return new UserRolesService(repository, config)
}

/**
 * Default instance UserRolesService untuk penggunaan langsung
 * Menggunakan konfigurasi default
 */
export const userRolesService = createUserRolesService()