// rockman-app/src/repositories/sessions/sessions.repository.ts
import { Repository } from "@/core/core.repository"
import { sessions } from "@/db/schema/sessions"

/**
 * Sessions Repository dengan Dependency Injection Pattern
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * Memungkinkan testing yang mudah dengan mock repository
 */
export class SessionsRepository extends Repository<typeof sessions> {
  /**
   * Constructor untuk inisialisasi sessions repository
   * @param table - Schema tabel sessions (default: sessions)
   */
  constructor(table = sessions) {
    super(table)
  }

  /**
   * Method khusus untuk sessions - mencari berdasarkan user ID
   * @param userId - ID user yang dicari
   * @returns Promise array sessions untuk user tersebut
   */
  async findByUserId(userId: number) {
    const allSessions = await this.SELECT.All()
    return allSessions.filter(session => session.userId === userId)
  }

  /**
   * Method khusus untuk sessions - mencari berdasarkan refresh token
   * @param refreshToken - Refresh token yang dicari
   * @returns Promise session atau null jika tidak ditemukan
   */
  async findByRefreshToken(refreshToken: string) {
    const allSessions = await this.SELECT.All()
    return allSessions.find(session => session.refreshToken === refreshToken) || null
  }

  /**
   * Method khusus untuk sessions - mencari berdasarkan rentang tanggal expired
   * @param startDate - Tanggal mulai
   * @param endDate - Tanggal akhir
   * @returns Promise array sessions yang expired dalam rentang tanggal tersebut
   */
  async findByExpiredDateRange(startDate: Date, endDate: Date) {
    const allSessions = await this.SELECT.All()
    return allSessions.filter(session => 
      session.expiresAt >= startDate && session.expiresAt <= endDate
    )
  }

  /**
   * Method khusus untuk sessions - cek apakah session masih valid
   * @param refreshToken - Refresh token yang dicek
   * @returns Promise boolean apakah session masih valid
   */
  async isSessionValid(refreshToken: string): Promise<boolean> {
    const session = await this.findByRefreshToken(refreshToken)
    if (!session) return false
    
    const now = new Date()
    return session.expiresAt > now
  }

  /**
   * Method khusus untuk sessions - mendapatkan jumlah sessions untuk user tertentu
   * @param userId - ID user
   * @returns Promise jumlah sessions untuk user tersebut
   */
  async countSessionsByUser(userId: number): Promise<number> {
    const userSessions = await this.findByUserId(userId)
    return userSessions.length
  }

  /**
   * Method khusus untuk sessions - mendapatkan jumlah total sessions
   * @returns Promise jumlah total sessions
   */
  async countTotalSessions(): Promise<number> {
    const allSessions = await this.SELECT.All()
    return allSessions.length
  }
}

/**
 * Factory function untuk membuat instance SessionsRepository
 * Memudahkan dependency injection dan testing
 * 
 * @returns Instance SessionsRepository yang siap digunakan
 */
export function createSessionsRepository(): SessionsRepository {
  return new SessionsRepository()
}

/**
 * Default instance SessionsRepository untuk penggunaan langsung
 * Dapat digunakan untuk backward compatibility
 */
export const sessionsRepository = createSessionsRepository()

/**
 * Alias untuk backward compatibility dengan kode lama
 * @deprecated Gunakan sessionsRepository atau createSessionsRepository() sebagai gantinya
 */
export const SessionRepository = sessionsRepository