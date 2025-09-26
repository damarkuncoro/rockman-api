// rockman-api/src/services/change_history/change_history.service.ts
import { Service } from '../../../core/core.service'
import { ChangeHistoryRepository, createChangeHistoryRepository } from '../../../repositories/change_history/change_history.repository'
import { changeHistory } from '../../../db/schema/change_history'
import { IServiceConfig } from '../../../core/core.interface'

/**
 * Change History Service dengan Dependency Injection
 * Menggunakan Repository pattern untuk akses data
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 */
export class ChangeHistoryService extends Service<typeof changeHistory> {
  /**
   * Constructor dengan dependency injection
   * @param repository - Instance ChangeHistoryRepository yang di-inject
   * @param config - Konfigurasi service (optional)
   */
  constructor(
    repository: ChangeHistoryRepository,
    config?: IServiceConfig
  ) {
    super(repository, config)
  }

  /**
   * Method khusus untuk mencari change history berdasarkan user ID
   * @param userId - ID user yang dicari
   * @returns Promise array change history untuk user tersebut
   */
  async findByUserId(userId: number) {
    if (this.config.enableLogging) {
      console.log(`[ChangeHistoryService] Finding change history by user ID: ${userId}`)
    }
    
    const repository = this.repository as ChangeHistoryRepository
    return await repository.findByUserId(userId)
  }

  /**
   * Method khusus untuk mencari change history berdasarkan table name
   * @param tableName - Nama tabel yang dicari
   * @returns Promise array change history untuk tabel tersebut
   */
  async findByTableName(tableName: string) {
    if (this.config.enableLogging) {
      console.log(`[ChangeHistoryService] Finding change history by table name: ${tableName}`)
    }
    
    const repository = this.repository as ChangeHistoryRepository
    return await repository.findByTableName(tableName)
  }

  /**
   * Method khusus untuk mencari change history berdasarkan record ID
   * @param recordId - ID record yang dicari
   * @returns Promise array change history untuk record tersebut
   */
  async findByRecordId(recordId: number) {
    if (this.config.enableLogging) {
      console.log(`[ChangeHistoryService] Finding change history by record ID: ${recordId}`)
    }
    
    const repository = this.repository as ChangeHistoryRepository
    return await repository.findByRecordId(recordId)
  }

  /**
   * Method khusus untuk mencari change history berdasarkan action
   * @param action - Action yang dicari (CREATE, UPDATE, DELETE)
   * @returns Promise array change history dengan action tersebut
   */
  async findByAction(action: string) {
    if (this.config.enableLogging) {
      console.log(`[ChangeHistoryService] Finding change history by action: ${action}`)
    }
    
    const repository = this.repository as ChangeHistoryRepository
    return await repository.findByAction(action)
  }

  /**
   * Method khusus untuk mencari change history berdasarkan rentang tanggal
   * @param startDate - Tanggal mulai
   * @param endDate - Tanggal akhir
   * @returns Promise array change history dalam rentang tanggal tersebut
   */
  async findByDateRange(startDate: Date, endDate: Date) {
    if (this.config.enableLogging) {
      console.log(`[ChangeHistoryService] Finding change history by date range: ${startDate.toISOString()} - ${endDate.toISOString()}`)
    }
    
    const repository = this.repository as ChangeHistoryRepository
    return await repository.findByDateRange(startDate, endDate)
  }

  /**
   * Method khusus untuk mencari change history berdasarkan tabel dan record ID
   * @param tableName - Nama tabel yang dicari
   * @param recordId - ID record yang dicari
   * @returns Promise array change history untuk kombinasi tabel dan record tersebut
   */
  async findByTableAndRecord(tableName: string, recordId: number) {
    if (this.config.enableLogging) {
      console.log(`[ChangeHistoryService] Finding change history by table: ${tableName} and record ID: ${recordId}`)
    }
    
    const repository = this.repository as ChangeHistoryRepository
    return await repository.findByTableAndRecord(tableName, recordId)
  }
}

/**
 * Factory function untuk membuat instance ChangeHistoryService
 * Memudahkan dependency injection dan testing
 * 
 * @param config - Konfigurasi service (optional)
 * @returns Instance ChangeHistoryService yang siap digunakan
 */
export function createChangeHistoryService(config?: IServiceConfig): ChangeHistoryService {
  const repository = createChangeHistoryRepository()
  return new ChangeHistoryService(repository, config)
}

/**
 * Default instance ChangeHistoryService untuk penggunaan langsung
 * Menggunakan konfigurasi default
 */
export const changeHistoryService = createChangeHistoryService()