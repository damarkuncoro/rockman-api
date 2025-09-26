// rockman-api/src/services/access_logs/access_logs.service.ts
import { Service } from '../../../core/core.service'
import { AccessLogsRepository, createAccessLogsRepository } from '../../../repositories/access_logs/access_logs.repository'
import { accessLogs } from '../../../db/schema/access_logs'
import { IServiceConfig } from '../../../core/core.interface'

/**
 * Access Logs Service dengan Dependency Injection
 * Menggunakan Repository pattern untuk akses data
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 */
export class AccessLogsService extends Service<typeof accessLogs> {
  /**
   * Constructor dengan dependency injection
   * @param repository - Instance AccessLogsRepository yang di-inject
   * @param config - Konfigurasi service (optional)
   */
  constructor(
    repository: AccessLogsRepository,
    config?: IServiceConfig
  ) {
    super(repository, config)
  }

  /**
   * Method khusus untuk mencari access logs berdasarkan user ID
   * @param userId - ID user yang dicari
   * @returns Promise array access logs untuk user tersebut
   */
  async findByUserId(userId: number) {
    if (this.config.enableLogging) {
      console.log(`[AccessLogsService] Finding access logs by user ID: ${userId}`)
    }
    
    const repository = this.repository as AccessLogsRepository
    return await repository.findByUserId(userId)
  }

  /**
   * Method khusus untuk mencari access logs berdasarkan path
   * @param path - Path yang dicari
   * @returns Promise array access logs untuk path tersebut
   */
  async findByPath(path: string) {
    if (this.config.enableLogging) {
      console.log(`[AccessLogsService] Finding access logs by path: ${path}`)
    }
    
    const repository = this.repository as AccessLogsRepository
    return await repository.findByPath(path)
  }

  /**
   * Method khusus untuk mencari access logs berdasarkan decision
   * @param decision - Decision (allow/deny) yang dicari
   * @returns Promise array access logs dengan decision tersebut
   */
  async findByDecision(decision: string) {
    if (this.config.enableLogging) {
      console.log(`[AccessLogsService] Finding access logs by decision: ${decision}`)
    }
    
    const repository = this.repository as AccessLogsRepository
    return await repository.findByDecision(decision)
  }

  /**
   * Method khusus untuk mencari access logs berdasarkan feature ID
   * @param featureId - ID feature yang dicari
   * @returns Promise array access logs untuk feature tersebut
   */
  async findByFeatureId(featureId: number) {
    if (this.config.enableLogging) {
      console.log(`[AccessLogsService] Finding access logs by feature ID: ${featureId}`)
    }
    
    const repository = this.repository as AccessLogsRepository
    return await repository.findByFeatureId(featureId)
  }

  /**
   * Method khusus untuk mencari access logs berdasarkan rentang tanggal
   * @param startDate - Tanggal mulai
   * @param endDate - Tanggal akhir
   * @returns Promise array access logs dalam rentang tanggal tersebut
   */
  async findByDateRange(startDate: Date, endDate: Date) {
    if (this.config.enableLogging) {
      console.log(`[AccessLogsService] Finding access logs by date range: ${startDate.toISOString()} - ${endDate.toISOString()}`)
    }
    
    const repository = this.repository as AccessLogsRepository
    return await repository.findByDateRange(startDate, endDate)
  }
}

/**
 * Factory function untuk membuat instance AccessLogsService
 * Memudahkan dependency injection dan testing
 * 
 * @param config - Konfigurasi service (optional)
 * @returns Instance AccessLogsService yang siap digunakan
 */
export function createAccessLogsService(config?: IServiceConfig): AccessLogsService {
  const repository = createAccessLogsRepository()
  return new AccessLogsService(repository, config)
}

/**
 * Default instance AccessLogsService untuk penggunaan langsung
 * Menggunakan konfigurasi default
 */
export const accessLogsService = createAccessLogsService()