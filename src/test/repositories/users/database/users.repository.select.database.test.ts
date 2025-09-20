// rockman-app/src/test/repositories/users/database/users.repository.select.database.test.ts
/**
 * Database Integration Tests untuk UserRepository SELECT Operations
 * Fokus pada testing operasi SELECT dengan database real
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
   * Cleanup users yang dibuat untuk testing
   * Menghapus berdasarkan pattern email dan nama yang spesifik untuk testing
   */
  static async cleanupUsers(): Promise<void> {
    try {
      // Cleanup berdasarkan pattern email test yang spesifik
      const testUsers = await db.select().from(users)
      for (const user of testUsers) {
        if (user.email.includes('select-test-') ||
            user.email.includes('update-test-') ||
            user.email.includes('insert-test-') ||
            user.email.includes('delete-test-') ||
            user.email.includes('error-test-') ||
            user.email.includes('duplicate-test-') ||
            user.email.includes('integration-test-') ||
            user.email.includes('custom-test-')) {
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
      name: 'Select Test User',
      email: 'select-test@example.com',
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
 * Database Integration Tests untuk UserRepository SELECT Operations
 * Testing operasi SELECT dengan database sesungguhnya
 */
describe('UserRepository - Database SELECT Operations Tests', () => {
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
    // Cleanup sebelum test dimulai
    await DatabaseTestHelper.cleanupUsers()
    // Tunggu sebentar untuk memastikan cleanup selesai
    await new Promise(resolve => setTimeout(resolve, 50))
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
    // Tunggu sebentar untuk memastikan cleanup selesai
    await new Promise(resolve => setTimeout(resolve, 50))
  })

  describe('Database SELECT Operations', () => {
    it('harus dapat mengambil semua users dari database', async () => {
      // Arrange - Insert single test user untuk test yang lebih reliable
      const testUserData = DatabaseTestHelper.createTestUserData({
        email: `select-all-unique-${Date.now()}@example.com`,
        name: 'Select All Unique User'
      })
      
      const createdUser = await repository.INSERT.One(testUserData)
      createdUserIds.push(createdUser.id)
      expect(createdUser.id).toBeDefined()

      // Verifikasi user ada dengan SELECT.ById terlebih dahulu
      const verifyUser = await repository.SELECT.ById(createdUser.id)
      expect(verifyUser).toBeDefined()
      expect(verifyUser?.id).toBe(createdUser.id)

      // Act - Ambil semua users dari database
      const result = await repository.SELECT.All()

      // Assert - Verifikasi hasil
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      
      // Verifikasi user yang baru dibuat ada dalam hasil
      const foundUser = result.find(user => user.id === createdUser.id)
      expect(foundUser).toBeDefined()
      expect(foundUser?.email).toBe(testUserData.email)
      expect(foundUser?.name).toBe(testUserData.name)
    })

    it('harus dapat mengambil user berdasarkan ID dari database', async () => {
      // Arrange
      const timestamp = Date.now()
      const testUserData = DatabaseTestHelper.createTestUserData({
        email: `test-select-by-id-${timestamp}@example.com`,
        name: 'Test Select By ID User'
      })
      
      // Tunggu sebentar sebelum insert untuk memastikan database ready
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const createdUser = await repository.INSERT.One(testUserData)
      createdUserIds.push(createdUser.id)

      // Pastikan user benar-benar tersimpan
      expect(createdUser.id).toBeDefined()
      expect(typeof createdUser.id).toBe('number')

      // Tunggu lebih lama untuk memastikan database state konsisten
      await new Promise(resolve => setTimeout(resolve, 200))

      // Act
      const result = await repository.SELECT.ById(createdUser.id)

      // Assert
      expect(result).toBeDefined()
      expect(result).not.toBeNull()
      expect(result?.id).toBe(createdUser.id)
      expect(result?.email).toBe(testUserData.email)
      expect(result?.name).toBe(testUserData.name)
    })

    it('harus mengembalikan null jika user tidak ditemukan', async () => {
      // Act
      const result = await repository.SELECT.ById(99999)

      // Assert
      expect(result).toBeNull()
    })
  })
})