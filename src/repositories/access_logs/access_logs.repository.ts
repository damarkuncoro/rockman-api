// rockman-api/src/repositories/access_logs/access_logs.repository.ts
import { Repository } from "@/core/core.repository"
import { accessLogs } from "@/db/schema/access_logs"

/**
 * Access Logs Repository dengan Dependency Injection Pattern
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * Memungkinkan testing yang mudah dengan mock repository
 */
export class AccessLogsRepository extends Repository<typeof accessLogs> {
  /**
   * Constructor untuk inisialisasi access logs repository
   * @param table - Schema tabel access_logs (default: accessLogs)
   */
  constructor(table = accessLogs) {
    super(table)
  }

  /**
   * Method khusus untuk access logs - mencari berdasarkan user ID
   * @param userId - ID user yang dicari
   * @returns Promise array access logs untuk user tersebut
   */
  async findByUserId(userId: number) {
    const allLogs = await this.SELECT.All()
    return allLogs.filter(log => log.userId === userId)
  }

  /**
   * Method khusus untuk access logs - mencari berdasarkan path
   * @param path - Path yang dicari
   * @returns Promise array access logs untuk path tersebut
   */
  async findByPath(path: string) {
    const allLogs = await this.SELECT.All()
    return allLogs.filter(log => log.path === path)
  }

  /**
   * Method khusus untuk access logs - mencari berdasarkan decision
   * @param decision - Decision (allow/deny) yang dicari
   * @returns Promise array access logs dengan decision tersebut
   */
  async findByDecision(decision: string) {
    const allLogs = await this.SELECT.All()
    return allLogs.filter(log => log.decision === decision)
  }

  /**
   * Method khusus untuk access logs - mencari berdasarkan feature ID
   * @param featureId - ID feature yang dicari
   * @returns Promise array access logs untuk feature tersebut
   */
  async findByFeatureId(featureId: number) {
    const allLogs = await this.SELECT.All()
    return allLogs.filter(log => log.featureId === featureId)
  }

  /**
   * Method khusus untuk access logs - mencari berdasarkan rentang tanggal
   * @param startDate - Tanggal mulai
   * @param endDate - Tanggal akhir
   * @returns Promise array access logs dalam rentang tanggal tersebut
   */
  async findByDateRange(startDate: Date, endDate: Date) {
    const allLogs = await this.SELECT.All()
    return allLogs.filter(log => 
      log.createdAt >= startDate && log.createdAt <= endDate
    )
  }
}

/**
 * Factory function untuk membuat instance AccessLogsRepository
 * Memudahkan dependency injection dan testing
 * 
 * @returns Instance AccessLogsRepository yang siap digunakan
 */
export function createAccessLogsRepository(): AccessLogsRepository {
  return new AccessLogsRepository()
}

/**
 * Default instance AccessLogsRepository untuk penggunaan langsung
 * Dapat digunakan untuk backward compatibility
 */
export const accessLogsRepository = createAccessLogsRepository()

/**
 * Alias untuk backward compatibility dengan kode lama
 * @deprecated Gunakan accessLogsRepository atau createAccessLogsRepository() sebagai gantinya
 */
export const AccessLogRepository = accessLogsRepository