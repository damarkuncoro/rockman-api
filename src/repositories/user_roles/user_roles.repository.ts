// rockman-app/src/repositories/user_roles/user_roles.repository.ts
import { Repository } from "@/core/core.repository"
import { userRoles } from "@/db/schema/user_roles"

/**
 * User Roles Repository dengan Dependency Injection Pattern
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * Memungkinkan testing yang mudah dengan mock repository
 */
export class UserRolesRepository extends Repository<typeof userRoles> {
  /**
   * Constructor untuk inisialisasi user roles repository
   * @param table - Schema tabel user_roles (default: userRoles)
   */
  constructor(table = userRoles) {
    super(table)
  }

  /**
   * Method khusus untuk user roles - mencari berdasarkan user ID
   * @param userId - ID user yang dicari
   * @returns Promise array user roles untuk user tersebut
   */
  async findByUserId(userId: number) {
    const allUserRoles = await this.SELECT.All()
    return allUserRoles.filter(userRole => userRole.userId === userId)
  }

  /**
   * Method khusus untuk user roles - mencari berdasarkan role ID
   * @param roleId - ID role yang dicari
   * @returns Promise array user roles untuk role tersebut
   */
  async findByRoleId(roleId: number) {
    const allUserRoles = await this.SELECT.All()
    return allUserRoles.filter(userRole => userRole.roleId === roleId)
  }

  /**
   * Method khusus untuk user roles - mencari berdasarkan user dan role
   * @param userId - ID user
   * @param roleId - ID role
   * @returns Promise user role atau null jika tidak ditemukan
   */
  async findByUserAndRole(userId: number, roleId: number) {
    const allUserRoles = await this.SELECT.All()
    return allUserRoles.find(userRole => 
      userRole.userId === userId && userRole.roleId === roleId
    ) || null
  }

  /**
   * Method khusus untuk user roles - mendapatkan semua role IDs untuk user
   * @param userId - ID user
   * @returns Promise array role IDs yang dimiliki user
   */
  async getRoleIdsByUser(userId: number) {
    const userRolesList = await this.findByUserId(userId)
    return userRolesList.map(userRole => userRole.roleId)
  }

  /**
   * Method khusus untuk user roles - mendapatkan semua user IDs yang memiliki role
   * @param roleId - ID role
   * @returns Promise array user IDs yang memiliki role
   */
  async getUserIdsByRole(roleId: number) {
    const userRolesList = await this.findByRoleId(roleId)
    return userRolesList.map(userRole => userRole.userId)
  }

  /**
   * Method khusus untuk user roles - mencari berdasarkan multiple user IDs
   * @param userIds - Array ID users yang dicari
   * @returns Promise array user roles untuk users tersebut
   */
  async findByUserIds(userIds: number[]) {
    const allUserRoles = await this.SELECT.All()
    return allUserRoles.filter(userRole => userIds.includes(userRole.userId))
  }

  /**
   * Method khusus untuk user roles - cek apakah user memiliki role tertentu
   * @param userId - ID user
   * @param roleId - ID role
   * @returns Promise boolean apakah user memiliki role tersebut
   */
  async hasUserRole(userId: number, roleId: number): Promise<boolean> {
    const userRole = await this.findByUserAndRole(userId, roleId)
    return userRole !== null
  }

  /**
   * Method khusus untuk user roles - mendapatkan jumlah users per role
   * @param roleId - ID role
   * @returns Promise jumlah users yang memiliki role tersebut
   */
  async countUsersByRole(roleId: number): Promise<number> {
    const userRolesList = await this.findByRoleId(roleId)
    return userRolesList.length
  }

  /**
   * Method khusus untuk user roles - mendapatkan jumlah roles per user
   * @param userId - ID user
   * @returns Promise jumlah roles yang dimiliki user tersebut
   */
  async countRolesByUser(userId: number): Promise<number> {
    const userRolesList = await this.findByUserId(userId)
    return userRolesList.length
  }
}

/**
 * Factory function untuk membuat instance UserRolesRepository
 * Memudahkan dependency injection dan testing
 * 
 * @returns Instance UserRolesRepository yang siap digunakan
 */
export function createUserRolesRepository(): UserRolesRepository {
  return new UserRolesRepository()
}

/**
 * Default instance UserRolesRepository untuk penggunaan langsung
 * Dapat digunakan untuk backward compatibility
 */
export const userRolesRepository = createUserRolesRepository()

/**
 * Alias untuk backward compatibility dengan kode lama
 * @deprecated Gunakan userRolesRepository atau createUserRolesRepository() sebagai gantinya
 */
export const UserRoleRepository = userRolesRepository