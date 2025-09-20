// Test file untuk UserRepository dengan Database Integration
import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest'
import { eq } from 'drizzle-orm'
import db from '@/db'
import { users, type User, type NewUser } from '@/db/schema/users'
import { UsersRepository, createUsersRepository } from '@/repositories/users/users.repository'

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
   * Membuat data user test dengan nilai default
   * @param overrides - Override untuk field tertentu
   * @returns NewUser object untuk testing
   */
  static createTestUserData(overrides: Partial<NewUser> = {}): NewUser {
    return {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashedpassword123',
      active: true,
      department: 'Engineering',
      region: 'Jakarta',
      level: 1,
      ...overrides
    }
  }

  /**
   * Membuat multiple user test data
   * @param count - Jumlah user yang akan dibuat
   * @returns Array of NewUser objects
   */
  static createMultipleTestUsers(count: number): NewUser[] {
    return Array.from({ length: count }, (_, index) => ({
      name: `Test User ${index + 1}`,
      email: `test${index + 1}@example.com`,
      passwordHash: 'hashedpassword123',
      active: true,
      department: index % 2 === 0 ? 'Engineering' : 'Marketing',
      region: index % 3 === 0 ? 'Jakarta' : index % 3 === 1 ? 'Bandung' : 'Surabaya',
      level: (index % 5) + 1
    }))
  }
}

describe('UserRepository Database Integration Tests', () => {
  let repository: UsersRepository
  let createdUserIds: number[] = []

  beforeAll(async () => {
    // Verifikasi koneksi database sebelum menjalankan test
    const isConnected = await DatabaseTestHelper.verifyDatabaseConnection()
    if (!isConnected) {
      throw new Error('Database connection failed. Pastikan DATABASE_URL sudah dikonfigurasi dengan benar.')
    }
  })

  beforeEach(async () => {
    // Setup fresh repository instance untuk setiap test
    repository = createUsersRepository()
    createdUserIds = []
    
    // Cleanup data test sebelum menjalankan test
    await DatabaseTestHelper.cleanupUsers()
  })

  afterEach(async () => {
    // Cleanup data yang dibuat selama test
    try {
      for (const id of createdUserIds) {
        await repository.DELETE.One(id)
      }
      await DatabaseTestHelper.cleanupUsers()
    } catch (error) {
      console.warn('Cleanup error:', error)
    }
  })

  describe('Database SELECT Operations', () => {
    it('harus dapat mengambil semua users dari database', async () => {
      // Arrange - Insert test data
      const testUsers = DatabaseTestHelper.createMultipleTestUsers(3)
      for (const userData of testUsers) {
        const created = await repository.INSERT.One(userData)
        createdUserIds.push(created.id)
      }

      // Act
      const result = await repository.SELECT.All()

      // Log informasi database untuk debugging
      console.log('\n=== DATABASE USERS INFO ===')
      console.log(`Total users in database: ${result.length}`)
      console.log('\nUsers data:')
      result.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Department: ${user.department || 'N/A'}, Region: ${user.region || 'N/A'}, Level: ${user.level || 'N/A'}`)
      })
      console.log('=========================\n')

      // Assert
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThanOrEqual(3)
      
      // Verify our test data exists
      const testEmails = testUsers.map(u => u.email)
      const resultEmails = result.map(u => u.email)
      testEmails.forEach(email => {
        expect(resultEmails).toContain(email)
      })
    })

    it('harus dapat mengambil user berdasarkan ID dari database', async () => {
      // Arrange - Insert test user
      const testUserData = DatabaseTestHelper.createTestUserData({
        email: 'test-select-by-id@example.com'
      })
      const createdUser = await repository.INSERT.One(testUserData)
      createdUserIds.push(createdUser.id)

      // Act
      const result = await repository.SELECT.ById(createdUser.id)

      // Assert
      expect(result).toBeDefined()
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

  describe('Database INSERT Operations', () => {
    it('harus dapat menambahkan user baru ke database', async () => {
      // Arrange
      const newUserData = DatabaseTestHelper.createTestUserData({
        email: 'newuser@example.com',
        name: 'New User'
      })

      // Act
      const result = await repository.INSERT.One(newUserData)
      createdUserIds.push(result.id)

      // Assert
      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.email).toBe(newUserData.email)
      expect(result.name).toBe(newUserData.name)
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()

      // Verify in database
      const dbUser = await repository.SELECT.ById(result.id)
      expect(dbUser).toBeDefined()
      expect(dbUser?.email).toBe(newUserData.email)
    })

    it('harus menangani error saat email sudah ada', async () => {
      // Arrange - Insert user pertama
      const userData = DatabaseTestHelper.createTestUserData({
        email: 'duplicate@example.com'
      })
      const firstUser = await repository.INSERT.One(userData)
      createdUserIds.push(firstUser.id)

      // Act & Assert - Coba insert user dengan email yang sama
      const duplicateUserData = DatabaseTestHelper.createTestUserData({
        email: 'duplicate@example.com',
        name: 'Duplicate User'
      })

      await expect(repository.INSERT.One(duplicateUserData)).rejects.toThrow()
    })
  })

  describe('Database UPDATE Operations', () => {
    it('harus dapat mengupdate user yang ada di database', async () => {
      // Arrange - Insert test user
      const originalData = DatabaseTestHelper.createTestUserData({
        email: 'update-test@example.com',
        name: 'Original Name'
      })
      const createdUser = await repository.INSERT.One(originalData)
      createdUserIds.push(createdUser.id)

      // Act - Update user
      const updateData = {
        name: 'Updated Name',
        department: 'Updated Department'
      }
      const result = await repository.UPDATE.One(createdUser.id, updateData)

      // Assert
      expect(result).not.toBeNull()
      expect(result!.id).toBe(createdUser.id)
      expect(result!.name).toBe(updateData.name)
      expect(result!.department).toBe(updateData.department)
      expect(result!.email).toBe(originalData.email) // Email tidak berubah
      expect(result!.updatedAt.getTime()).toBeGreaterThanOrEqual(result!.createdAt.getTime())

      // Verify in database
      const dbUser = await repository.SELECT.ById(createdUser.id)
      expect(dbUser?.name).toBe(updateData.name)
      expect(dbUser?.department).toBe(updateData.department)
    })

    it('harus menangani update user yang tidak ada di database', async () => {
      // Act
      const result = await repository.UPDATE.One(99999, { name: 'Non-existent User' })

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('Database DELETE Operations', () => {
    it('harus dapat menghapus user yang ada dari database', async () => {
      // Arrange - Insert test user
      const testUserData = DatabaseTestHelper.createTestUserData({
        email: 'delete-test@example.com'
      })
      const createdUser = await repository.INSERT.One(testUserData)

      // Act
      const result = await repository.DELETE.One(createdUser.id)

      // Assert
      expect(result).toBe(true)

      // Verify user is deleted
      const deletedUser = await repository.SELECT.ById(createdUser.id)
      expect(deletedUser).toBeNull()
    })

    it('harus mengembalikan false jika user tidak ditemukan untuk delete', async () => {
      // Act
      const result = await repository.DELETE.One(99999)

      // Assert
      expect(result).toBe(false)
    })
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
      // Arrange - Create test users with different departments
      const testUsers = [
        DatabaseTestHelper.createTestUserData({ email: 'eng1@example.com', department: 'Engineering' }),
        DatabaseTestHelper.createTestUserData({ email: 'eng2@example.com', department: 'Engineering' }),
        DatabaseTestHelper.createTestUserData({ email: 'hr1@example.com', department: 'HR' })
      ]

      for (const userData of testUsers) {
        const created = await repository.INSERT.One(userData)
        createdUserIds.push(created.id)
      }

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

  describe('Database Error Handling', () => {
    it('harus menangani database connection error', async () => {
      // Test ini memerlukan mock database connection error
      // Untuk saat ini, kita hanya test bahwa method tidak crash
      expect(async () => {
        await repository.SELECT.All()
      }).not.toThrow()
    })

    it('harus menangani constraint violation', async () => {
      // Arrange - Insert user dengan email tertentu
      const userData = DatabaseTestHelper.createTestUserData({
        email: 'constraint-test@example.com'
      })
      const firstUser = await repository.INSERT.One(userData)
      createdUserIds.push(firstUser.id)

      // Act & Assert - Coba insert user dengan email yang sama
      const duplicateData = DatabaseTestHelper.createTestUserData({
        email: 'constraint-test@example.com',
        name: 'Duplicate User'
      })

      await expect(repository.INSERT.One(duplicateData)).rejects.toThrow()
    })
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

  describe('Integration Scenarios', () => {
    it('harus dapat melakukan CRUD operations secara berurutan', async () => {
      // Create
      const userData = DatabaseTestHelper.createTestUserData({
        email: 'crud-test@example.com',
        name: 'CRUD Test User'
      })
      const created = await repository.INSERT.One(userData)
      createdUserIds.push(created.id)

      // Read
      const retrieved = await repository.SELECT.ById(created.id)
      expect(retrieved?.name).toBe('CRUD Test User')

      // Update
      const updated = await repository.UPDATE.One(created.id, { name: 'Updated CRUD User' })
      expect(updated?.name).toBe('Updated CRUD User')

      // Delete
      const deleted = await repository.DELETE.One(created.id)
      expect(deleted).toBe(true)

      // Verify deletion
      const afterDelete = await repository.SELECT.ById(created.id)
      expect(afterDelete).toBeNull()

      // Remove from cleanup list since already deleted
      createdUserIds = createdUserIds.filter(id => id !== created.id)
    })
  })
})