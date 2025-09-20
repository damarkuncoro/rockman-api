// rockman-app/src/test/repositories/users/database/users.repository.custom.database.test.ts
/**
 * Database Integration Tests untuk UserRepository Custom Methods
 * Fokus pada testing custom methods dengan database real
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
 * Database Integration Tests untuk UserRepository Custom Methods
 * Testing custom methods dengan database sesungguhnya
 */
describe('UserRepository - Database Custom Methods Tests', () => {
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

  describe('Database Custom Methods', () => {
    beforeEach(async () => {
      await DatabaseTestHelper.cleanupUsers()
    })

    it('harus dapat mencari user berdasarkan email', async () => {
      // Arrange
      const testUserData = DatabaseTestHelper.createTestUserData({
        email: 'search-email@example.com'
      })
      const createdUser = await repository.INSERT.One(testUserData)
      createdUserIds.push(createdUser.id)

      // Act
      const result = await repository.findByEmail('search-email@example.com')

      // Assert
      expect(result).toBeDefined()
      expect(result?.email).toBe('search-email@example.com')
      expect(result?.id).toBe(createdUser.id)
    })

    it('harus dapat mencari users berdasarkan department', async () => {
      // Arrange
      const timestamp = Date.now()
      const testUsers = [
        DatabaseTestHelper.createTestUserData({ 
          email: `custom-test-eng1-${timestamp}@example.com`, 
          department: 'Engineering' 
        }),
        DatabaseTestHelper.createTestUserData({ 
          email: `custom-test-eng2-${timestamp}@example.com`, 
          department: 'Engineering' 
        }),
        DatabaseTestHelper.createTestUserData({ 
          email: `custom-test-hr1-${timestamp}@example.com`, 
          department: 'HR' 
        })
      ]

      // Tunggu sebentar sebelum insert untuk memastikan database ready
      await new Promise(resolve => setTimeout(resolve, 50))

      for (const userData of testUsers) {
        const created = await repository.INSERT.One(userData)
        createdUserIds.push(created.id)
      }

      // Tunggu lebih lama untuk memastikan database state konsisten
      await new Promise(resolve => setTimeout(resolve, 200))

      // Act
      const engineeringUsers = await repository.findByDepartment('Engineering')
      const hrUsers = await repository.findByDepartment('HR')

      // Filter hanya users yang dibuat dalam test ini
      const testEngineeringUsers = engineeringUsers.filter(u => createdUserIds.includes(u.id))
      const testHrUsers = hrUsers.filter(u => createdUserIds.includes(u.id))

      // Assert
      expect(testEngineeringUsers).toHaveLength(2)
      expect(testHrUsers).toHaveLength(1)
      expect(testEngineeringUsers.every(u => u.department === 'Engineering')).toBe(true)
      expect(testHrUsers.every(u => u.department === 'HR')).toBe(true)
    })

    it('harus dapat mencari users berdasarkan region', async () => {
      // Cleanup data sebelum test
      await DatabaseTestHelper.cleanupUsers()
      
      // Arrange - Create test users with timestamp untuk unique emails
      const timestamp = Date.now()
      const testUsers = [
        DatabaseTestHelper.createTestUserData({ email: `jakarta1-${timestamp}@example.com`, region: 'Jakarta' }),
        DatabaseTestHelper.createTestUserData({ email: `jakarta2-${timestamp}@example.com`, region: 'Jakarta' }),
        DatabaseTestHelper.createTestUserData({ email: `bandung1-${timestamp}@example.com`, region: 'Bandung' }),
        DatabaseTestHelper.createTestUserData({ email: `surabaya1-${timestamp}@example.com`, region: 'Surabaya' })
      ]

      const createdIds: number[] = []
      for (const userData of testUsers) {
        const created = await repository.INSERT.One(userData)
        createdIds.push(created.id)
      }

      // Act
      const jakartaUsers = await repository.findByRegion('Jakarta')
      const bandungUsers = await repository.findByRegion('Bandung')
      const surabayaUsers = await repository.findByRegion('Surabaya')

      // Filter hasil berdasarkan user yang baru dibuat
      const jakartaFiltered = jakartaUsers.filter(u => createdIds.includes(u.id))
      const bandungFiltered = bandungUsers.filter(u => createdIds.includes(u.id))
      const surabayaFiltered = surabayaUsers.filter(u => createdIds.includes(u.id))

      // Assert
      expect(jakartaFiltered).toHaveLength(2)
      expect(bandungFiltered).toHaveLength(1)
      expect(surabayaFiltered).toHaveLength(1)

      // Cleanup data setelah test
      for (const id of createdIds) {
        await repository.DELETE.One(id)
      }
    })

    it('harus dapat mencari users berdasarkan minimum level', async () => {
      // Arrange - Create test users with different levels
      const testUsers = [
        DatabaseTestHelper.createTestUserData({ email: 'level1@example.com', level: 1 }),
        DatabaseTestHelper.createTestUserData({ email: 'level3@example.com', level: 3 }),
        DatabaseTestHelper.createTestUserData({ email: 'level5@example.com', level: 5 })
      ]

      for (const userData of testUsers) {
        const created = await repository.INSERT.One(userData)
        createdUserIds.push(created.id)
      }

      // Act
       const level3AndAbove = await repository.findByMinLevel(3)

       // Assert
       expect(level3AndAbove.length).toBeGreaterThanOrEqual(2)
       expect(level3AndAbove.every((u: any) => u.level !== null && u.level >= 3)).toBe(true)
    })
  })
})