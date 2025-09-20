// rockman-app/src/repositories/change_history/change_history.repository.ts
import { Repository } from "@/core/core.repository"
import { changeHistory } from "@/db/schema/change_history"

/**
 * Change History Repository dengan Dependency Injection Pattern
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * Memungkinkan testing yang mudah dengan mock repository
 */
export class ChangeHistoryRepository extends Repository<typeof changeHistory> {
  /**
   * Constructor untuk inisialisasi change history repository
   * @param table - Schema tabel change_history (default: changeHistory)
   */
  constructor(table = changeHistory) {
    super(table)
  }

  /**
   * Method khusus untuk change history - mencari berdasarkan user ID
   * @param userId - ID user yang dicari
   * @returns Promise array change history untuk user tersebut
   */
  async findByUserId(userId: number) {
    const allHistory = await this.SELECT.All()
    return allHistory.filter(history => history.userId === userId)
  }

  /**
   * Method khusus untuk change history - mencari berdasarkan table name
   * @param tableName - Nama tabel yang dicari
   * @returns Promise array change history untuk tabel tersebut
   */
  async findByTableName(tableName: string) {
    const allHistory = await this.SELECT.All()
    return allHistory.filter(history => history.tableName === tableName)
  }

  /**
   * Method khusus untuk change history - mencari berdasarkan record ID
   * @param recordId - ID record yang dicari
   * @returns Promise array change history untuk record tersebut
   */
  async findByRecordId(recordId: number) {
    const allHistory = await this.SELECT.All()
    return allHistory.filter(history => history.recordId === recordId)
  }

  /**
   * Method khusus untuk change history - mencari berdasarkan action
   * @param action - Action (create/update/delete) yang dicari
   * @returns Promise array change history dengan action tersebut
   */
  async findByAction(action: string) {
    const allHistory = await this.SELECT.All()
    return allHistory.filter(history => history.action === action)
  }

  /**
   * Method khusus untuk change history - mencari berdasarkan rentang tanggal
   * @param startDate - Tanggal mulai
   * @param endDate - Tanggal akhir
   * @returns Promise array change history dalam rentang tanggal tersebut
   */
  async findByDateRange(startDate: Date, endDate: Date) {
    const allHistory = await this.SELECT.All()
    return allHistory.filter(history => 
      history.createdAt >= startDate && history.createdAt <= endDate
    )
  }

  /**
   * Method khusus untuk change history - mencari berdasarkan tabel dan record ID
   * @param tableName - Nama tabel
   * @param recordId - ID record
   * @returns Promise array change history untuk tabel dan record tersebut
   */
  async findByTableAndRecord(tableName: string, recordId: number) {
    const allHistory = await this.SELECT.All()
    return allHistory.filter(history => 
      history.tableName === tableName && history.recordId === recordId
    )
  }
}

/**
 * Factory function untuk membuat instance ChangeHistoryRepository
 * Memudahkan dependency injection dan testing
 * 
 * @returns Instance ChangeHistoryRepository yang siap digunakan
 */
export function createChangeHistoryRepository(): ChangeHistoryRepository {
  return new ChangeHistoryRepository()
}

/**
 * Default instance ChangeHistoryRepository untuk penggunaan langsung
 * Dapat digunakan untuk backward compatibility
 */
export const changeHistoryRepository = createChangeHistoryRepository()

/**
 * Alias untuk backward compatibility dengan kode lama
 * @deprecated Gunakan changeHistoryRepository atau createChangeHistoryRepository() sebagai gantinya
 */
export const ChangeHistoryRepositoryAlias = changeHistoryRepository