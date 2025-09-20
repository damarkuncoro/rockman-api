// rockman-app/src/repositories/users/users.repository.ts
import { Repository } from "../../core/core.repository"
import { users } from "../../db/schema/users"

/**
 * Users Repository dengan Dependency Injection Pattern
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * Memungkinkan testing yang mudah dengan mock repository
 */
export class UsersRepository extends Repository<typeof users> {
  /**
   * Constructor untuk inisialisasi users repository
   * @param table - Schema tabel users (default: users)
   */
  constructor(table = users) {
    super(table)
  }

  /**
   * Method khusus untuk users - mencari berdasarkan email
   * @param email - Email user yang dicari
   * @returns Promise user atau null jika tidak ditemukan
   */
  async findByEmail(email: string) {
    // Implementasi akan ditambahkan sesuai kebutuhan
    // Saat ini menggunakan method dasar dari parent class
    const allUsers = await this.SELECT.All()
    return allUsers.find(user => user.email === email) || null
  }

  /**
   * Method khusus untuk users - mencari berdasarkan department (ABAC)
   * @param department - Department yang dicari
   * @returns Promise array users dalam department tersebut
   */
  async findByDepartment(department: string) {
    const allUsers = await this.SELECT.All()
    return allUsers.filter(user => user.department === department)
  }

  /**
   * Method khusus untuk users - mencari berdasarkan region (ABAC)
   * @param region - Region yang dicari
   * @returns Promise array users dalam region tersebut
   */
  async findByRegion(region: string) {
    const allUsers = await this.SELECT.All()
    return allUsers.filter(user => user.region === region)
  }

  /**
   * Method khusus untuk users - mencari berdasarkan level minimum (ABAC)
   * @param minLevel - Level minimum yang dicari
   * @returns Promise array users dengan level >= minLevel
   */
  async findByMinLevel(minLevel: number) {
    const allUsers = await this.SELECT.All()
    return allUsers.filter(user => user.level !== null && user.level >= minLevel)
  }
}

/**
 * Factory function untuk membuat instance UsersRepository
 * Memudahkan dependency injection dan testing
 * 
 * @returns Instance UsersRepository yang siap digunakan
 */
export function createUsersRepository(): UsersRepository {
  return new UsersRepository()
}

/**
 * Default instance UsersRepository untuk penggunaan langsung
 * Dapat digunakan untuk backward compatibility
 */
export const usersRepository = createUsersRepository()

/**
 * Alias untuk backward compatibility dengan kode lama
 * @deprecated Gunakan usersRepository atau createUsersRepository() sebagai gantinya
 */
export const UserRepository = usersRepository
