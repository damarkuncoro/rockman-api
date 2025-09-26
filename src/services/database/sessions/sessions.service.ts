// rockman-api/src/services/sessions/sessions.service.ts
import { Service } from '../../../core/core.service'
import { SessionsRepository, createSessionsRepository } from '../../../repositories/sessions/sessions.repository'
import { sessions } from '../../../db/schema/sessions'
import { IServiceConfig } from '../../../core/core.interface'

/**
 * Sessions Service dengan Dependency Injection
 * Menggunakan Repository pattern untuk akses data
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 */
export class SessionsService extends Service<typeof sessions> {
  /**
   * Constructor dengan dependency injection
   * @param repository - Instance SessionsRepository yang di-inject
   * @param config - Konfigurasi service (optional)
   */
  constructor(
    repository: SessionsRepository,
    config?: IServiceConfig
  ) {
    super(repository, config)
  }

  /**
   * Method khusus untuk mencari sessions berdasarkan user ID
   * @param userId - ID user yang dicari
   * @returns Promise array sessions untuk user tersebut
   */
  async findByUserId(userId: number) {
    if (this.config.enableLogging) {
      console.log(`[SessionsService] Finding sessions by user ID: ${userId}`)
    }
    
    const repository = this.repository as SessionsRepository
    return await repository.findByUserId(userId)
  }

  /**
   * Method khusus untuk mencari session berdasarkan refresh token
   * @param refreshToken - Refresh token yang dicari
   * @returns Promise session atau null jika tidak ditemukan
   */
  async findByRefreshToken(refreshToken: string) {
    if (this.config.enableLogging) {
      console.log(`[SessionsService] Finding session by refresh token`)
    }
    
    const repository = this.repository as SessionsRepository
    return await repository.findByRefreshToken(refreshToken)
  }

  /**
   * Method khusus untuk mencari sessions berdasarkan rentang tanggal expired
   * @param startDate - Tanggal mulai
   * @param endDate - Tanggal akhir
   * @returns Promise array sessions yang expired dalam rentang tanggal tersebut
   */
  async findByExpiredDateRange(startDate: Date, endDate: Date) {
    if (this.config.enableLogging) {
      console.log(`[SessionsService] Finding sessions by expired date range: ${startDate.toISOString()} to ${endDate.toISOString()}`)
    }
    
    const repository = this.repository as SessionsRepository
    return await repository.findByExpiredDateRange(startDate, endDate)
  }

  /**
   * Method khusus untuk mengecek apakah session valid
   * @param refreshToken - Refresh token yang dicek
   * @returns Promise boolean apakah session valid
   */
  async isSessionValid(refreshToken: string): Promise<boolean> {
    if (this.config.enableLogging) {
      console.log(`[SessionsService] Checking if session is valid`)
    }
    
    const repository = this.repository as SessionsRepository
    return await repository.isSessionValid(refreshToken)
  }

  /**
   * Method khusus untuk menghitung sessions berdasarkan user
   * @param userId - ID user yang dicari
   * @returns Promise jumlah sessions untuk user tersebut
   */
  async countSessionsByUser(userId: number): Promise<number> {
    if (this.config.enableLogging) {
      console.log(`[SessionsService] Counting sessions by user ID: ${userId}`)
    }
    
    const repository = this.repository as SessionsRepository
    return await repository.countSessionsByUser(userId)
  }

  /**
   * Method khusus untuk menghitung total sessions
   * @returns Promise jumlah total sessions
   */
  async countTotalSessions(): Promise<number> {
    if (this.config.enableLogging) {
      console.log(`[SessionsService] Counting total sessions`)
    }
    
    const repository = this.repository as SessionsRepository
    return await repository.countTotalSessions()
  }
}

/**
 * Factory function untuk membuat instance SessionsService
 * Memudahkan dependency injection dan testing
 * 
 * @param config - Konfigurasi service (optional)
 * @returns Instance SessionsService yang siap digunakan
 */
export function createSessionsService(config?: IServiceConfig): SessionsService {
  const repository = createSessionsRepository()
  return new SessionsService(repository, config)
}

/**
 * Default instance SessionsService untuk penggunaan langsung
 * Menggunakan konfigurasi default
 */
export const sessionsService = createSessionsService()