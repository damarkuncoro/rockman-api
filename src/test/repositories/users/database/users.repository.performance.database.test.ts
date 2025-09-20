// rockman-app/src/test/repositories/users/database/users.repository.performance.database.test.ts
/**
 * Database Integration Tests untuk UserRepository Performance Tests
 * Fokus pada testing performance dengan database real
 * Menggunakan real database untuk memverifikasi integrasi penuh
 */
import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest'
import { eq } from 'drizzle-orm'
import db from '../../../../db'
import { users, type User, type NewUser } from '../../../../db/schema/users'
import { UsersRepository, createUsersRepository } from '../../../../repositories/users/users.repository'

/**
 * DatabaseTestHelper - Helper class untuk testing database
 * Menyediakan utility functions untuk setup, cleanup, dan verifikasi database
 */
class DatabaseTestHelper {
  /**
   * Verifikasi koneksi database
   * @returns Promise<boolean> - true jika koneksi berhasil
   */
  static async verifyDatabaseConnection(): Promise<boolean> {
    try {
      await db.execute('SELECT 1')
      return true
    } catch (error) {
      console.error('Database connection failed:', error)
      return false
    }
  }

  /**
   * Membersihkan semua data test dari tabel users
   */
  static async cleanupUsers(): Promise<void> {
    try {
      // Hapus semua user yang dibuat untuk testing (berdasarkan email pattern)
      await db.delete(users).where(eq(users.email, 'test@example.com'))
      await db.delete(users).where(eq(users.email, 'test1@example.com'))
      await db.delete(users).where(eq(users.email, 'test2@example.com'))
      await db.delete(users).where(eq(users.email, 'test3@example.com'))
      await db.delete(users).where(eq(users.email, 'newuser@example.com'))
      await db.delete(users).where(eq(users.email, 'existing@example.com'))
      await db.delete(users).where(eq(users.email, 'duplicate@example.com'))
      
      // Cleanup berdasarkan pattern email test
      const testUsers = await db.select().from(users)
      for (const user of testUsers) {
        if (user.email.includes('test') || user.name.includes('Test')) {
          await db.delete(users).where(eq(users.id, user.id))
        }
      }
    } catch (error) {
      console.warn('Cleanup warning:', error)
    }
  }

  /**
   * Membuat data user untuk testing
   * @param overrides - Override default values
   * @returns NewUser object untuk testing
   */
  static createTestUserData(overrides: Partial<NewUser> = {}): NewUser {
    return {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password_123',
      department: 'Engineering',
      region: 'Jakarta',
      level: 5,
      ...overrides
    }
  }

  /**
   * Membuat multiple test users
   * @param count - Jumlah users yang akan dibuat
   * @returns Array of NewUser objects
   */
  static createMultipleTestUsers(count: number): NewUser[] {
    return Array.from({ length: count }, (_, index) => ({
      name: `Test User ${index + 1}`,
      email: `test${index + 1}@example.com`,
      passwordHash: 'hashed_password_123',
      department: 'Engineering',
      region: 'Jakarta',
      level: 5
    }))
  }
}

/**
 * Database Integration Tests untuk UserRepository Performance Tests
 * Testing performance dengan database sesungguhnya
 */
describe('UserRepository - Database Performance Tests', () => {
  let repository: UsersRepository
  let createdUserIds: number[] = []

  /**
   * Setup sebelum semua test - verifikasi koneksi database
   */
  beforeAll(async () => {
    const isConnected = await DatabaseTestHelper.verifyDatabaseConnection()
    if (!isConnected) {
      throw new Error('Database connection failed. Cannot run integration tests.')
    }
  })

  /**
   * Setup untuk setiap test case
   * Create fresh repository instance dan reset tracking
   */
  beforeEach(async () => {
    repository = createUsersRepository()
    createdUserIds = []
    await DatabaseTestHelper.cleanupUsers()
  })

  /**
   * Cleanup setelah setiap test case
   * Hapus semua data test yang dibuat
   */
  afterEach(async () => {
    // Cleanup created users
    for (const id of createdUserIds) {
      try {
        await repository.DELETE.One(id)
      } catch (error) {
        console.warn(`Failed to cleanup user ${id}:`, error)
      }
    }
    await DatabaseTestHelper.cleanupUsers()
  })

  describe('Performance Tests', () => {
    it('harus menyelesaikan SELECT.All dalam waktu yang wajar', async () => {
      const startTime = Date.now()
      await repository.SELECT.All()
      const endTime = Date.now()
      
      expect(endTime - startTime).toBeLessThan(5000) // 5 detik
    })

    it('harus menangani concurrent operations', async () => {
      const promises = Array.from({ length: 5 }, (_, i) => 
        repository.INSERT.One(DatabaseTestHelper.createTestUserData({
          email: `concurrent-${i}@example.com`
        }))
      )

      const results = await Promise.all(promises)
      results.forEach(result => {
        createdUserIds.push(result.id)
        expect(result.id).toBeDefined()
      })
    })
  })
})