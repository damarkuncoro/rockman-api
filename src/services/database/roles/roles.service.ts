// rockman-app/src/services/roles/roles.service.ts
import { Service } from '../../../core/core.service'
import { RolesRepository, createRolesRepository } from '../../../repositories/roles/roles.repository'
import { roles } from '../../../db/schema/roles'
import { IServiceConfig } from '../../../core/core.interface'

/**
 * Roles Service dengan Dependency Injection
 * Menggunakan Repository pattern untuk akses data
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 */
export class RolesService extends Service<typeof roles> {
  /**
   * Constructor dengan dependency injection
   * @param repository - Instance RolesRepository yang di-inject
   * @param config - Konfigurasi service (optional)
   */
  constructor(
    repository: RolesRepository,
    config?: IServiceConfig
  ) {
    super(repository, config)
  }

  /**
   * Method khusus untuk mencari role berdasarkan nama
   * @param name - Nama role yang dicari
   * @returns Promise role atau null jika tidak ditemukan
   */
  async findByName(name: string) {
    if (this.config.enableLogging) {
      console.log(`[RolesService] Finding role by name: ${name}`)
    }
    
    const repository = this.repository as RolesRepository
    return await repository.findByName(name)
  }

  /**
   * Method khusus untuk mencari roles berdasarkan grants all status
   * @param grantsAll - Status grants all (true/false)
   * @returns Promise array roles dengan status tersebut
   */
  async findByGrantsAll(grantsAll: boolean) {
    if (this.config.enableLogging) {
      console.log(`[RolesService] Finding roles by grants all: ${grantsAll}`)
    }
    
    const repository = this.repository as RolesRepository
    return await repository.findByGrantsAll(grantsAll)
  }

  /**
   * Method khusus untuk mendapatkan semua roles yang grants all
   * @returns Promise array roles yang grants all
   */
  async findGrantsAllRoles() {
    if (this.config.enableLogging) {
      console.log(`[RolesService] Finding roles that grants all`)
    }
    
    const repository = this.repository as RolesRepository
    return await repository.findGrantsAllRoles()
  }

  /**
   * Method khusus untuk mendapatkan semua roles yang tidak grants all
   * @returns Promise array roles yang tidak grants all
   */
  async findNonGrantsAllRoles() {
    if (this.config.enableLogging) {
      console.log(`[RolesService] Finding roles that do not grant all`)
    }
    
    const repository = this.repository as RolesRepository
    return await repository.findNonGrantsAllRoles()
  }

  /**
   * Method khusus untuk mencari roles berdasarkan rentang tanggal
   * @param startDate - Tanggal mulai
   * @param endDate - Tanggal akhir
   * @returns Promise array roles dalam rentang tanggal tersebut
   */
  async findByDateRange(startDate: Date, endDate: Date) {
    if (this.config.enableLogging) {
      console.log(`[RolesService] Finding roles by date range: ${startDate.toISOString()} to ${endDate.toISOString()}`)
    }
    
    const repository = this.repository as RolesRepository
    return await repository.findByDateRange(startDate, endDate)
  }

  /**
   * Method khusus untuk mencari roles berdasarkan pola nama
   * @param pattern - Pola nama yang dicari
   * @returns Promise array roles yang sesuai dengan pola nama
   */
  async findByNamePattern(pattern: string) {
    if (this.config.enableLogging) {
      console.log(`[RolesService] Finding roles by name pattern: ${pattern}`)
    }
    
    const repository = this.repository as RolesRepository
    return await repository.findByNamePattern(pattern)
  }

  /**
   * Method khusus untuk menghitung roles berdasarkan grants all status
   * @param grantsAll - Status grants all (optional)
   * @returns Promise jumlah roles dengan status tersebut
   */
  async countByGrantsAll(grantsAll?: boolean) {
    if (this.config.enableLogging) {
      console.log(`[RolesService] Counting roles by grants all: ${grantsAll}`)
    }
    
    const repository = this.repository as RolesRepository
    return await repository.countByGrantsAll(grantsAll)
  }
}

/**
 * Factory function untuk membuat instance RolesService
 * Memudahkan dependency injection dan testing
 * 
 * @param config - Konfigurasi service (optional)
 * @returns Instance RolesService yang siap digunakan
 */
export function createRolesService(config?: IServiceConfig): RolesService {
  const repository = createRolesRepository()
  return new RolesService(repository, config)
}

/**
 * Default instance RolesService untuk penggunaan langsung
 * Menggunakan konfigurasi default
 */
export const rolesService = createRolesService()