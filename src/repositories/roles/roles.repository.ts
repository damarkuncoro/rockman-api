// rockman-app/src/repositories/roles/roles.repository.ts
import { Repository } from "@/core/core.repository"
import { roles } from "@/db/schema/roles"

/**
 * Roles Repository dengan Dependency Injection Pattern
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * Memungkinkan testing yang mudah dengan mock repository
 */
export class RolesRepository extends Repository<typeof roles> {
  /**
   * Constructor untuk inisialisasi roles repository
   * @param table - Schema tabel roles (default: roles)
   */
  constructor(table = roles) {
    super(table)
  }

  /**
   * Method khusus untuk roles - mencari berdasarkan nama role
   * @param name - Nama role yang dicari
   * @returns Promise role atau null jika tidak ditemukan
   */
  async findByName(name: string) {
    const allRoles = await this.SELECT.All()
    return allRoles.find(role => role.name === name) || null
  }

  /**
   * Method khusus untuk roles - mencari berdasarkan grants all status
   * @param grantsAll - Status grants all (true/false)
   * @returns Promise array roles dengan status tersebut
   */
  async findByGrantsAll(grantsAll: boolean) {
    const allRoles = await this.SELECT.All()
    return allRoles.filter(role => role.grantsAll === grantsAll)
  }

  /**
   * Method khusus untuk roles - mendapatkan semua roles yang grants all
   * @returns Promise array roles yang grants all
   */
  async findGrantsAllRoles() {
    return this.findByGrantsAll(true)
  }

  /**
   * Method khusus untuk roles - mendapatkan semua roles yang tidak grants all
   * @returns Promise array roles yang tidak grants all
   */
  async findNonGrantsAllRoles() {
    return this.findByGrantsAll(false)
  }

  /**
   * Method khusus untuk roles - mencari berdasarkan rentang tanggal pembuatan
   * @param startDate - Tanggal mulai
   * @param endDate - Tanggal akhir
   * @returns Promise array roles dalam rentang tanggal tersebut
   */
  async findByDateRange(startDate: Date, endDate: Date) {
    const allRoles = await this.SELECT.All()
    return allRoles.filter(role => 
      role.createdAt >= startDate && role.createdAt <= endDate
    )
  }

  /**
   * Method khusus untuk roles - mencari berdasarkan pattern nama
   * @param pattern - Pattern nama yang dicari (case insensitive)
   * @returns Promise array roles yang cocok dengan pattern
   */
  async findByNamePattern(pattern: string) {
    const allRoles = await this.SELECT.All()
    const regex = new RegExp(pattern, 'i')
    return allRoles.filter(role => regex.test(role.name))
  }

  /**
   * Method khusus untuk roles - mendapatkan jumlah roles berdasarkan grants all status
   * @param grantsAll - Status grants all (optional)
   * @returns Promise jumlah roles
   */
  async countByGrantsAll(grantsAll?: boolean) {
    const allRoles = await this.SELECT.All()
    if (grantsAll === undefined) {
      return allRoles.length
    }
    return allRoles.filter(role => role.grantsAll === grantsAll).length
  }
}

/**
 * Factory function untuk membuat instance RolesRepository
 * Memudahkan dependency injection dan testing
 * 
 * @returns Instance RolesRepository yang siap digunakan
 */
export function createRolesRepository(): RolesRepository {
  return new RolesRepository()
}

/**
 * Default instance RolesRepository untuk penggunaan langsung
 * Dapat digunakan untuk backward compatibility
 */
export const rolesRepository = createRolesRepository()

/**
 * Alias untuk backward compatibility dengan kode lama
 * @deprecated Gunakan rolesRepository atau createRolesRepository() sebagai gantinya
 */
export const RoleRepository = rolesRepository