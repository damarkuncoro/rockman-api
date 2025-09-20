// rockman-app/src/test/services/users/integration/users.service.get.integration.test.ts
/**
 * Integration Tests untuk Users Service GET Operations dengan Real Repository
 * Fokus pada testing operasi GET (SELECT) dengan database real
 * Menggunakan real repository untuk memverifikasi integrasi penuh
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Service } from '@/core/core.service'
import { users, type User, type NewUser } from '@/db/schema/users'
import { createUsersRepository } from '@/repositories/users/users.repository'

/**
 * Helper class untuk mengelola test data dan cleanup
 * Memastikan test isolation dan cleanup yang proper
 */
class ServiceTestHelper {
  private createdUserIds: number[] = []
  private repository = createUsersRepository()

  /**
   * Membuat user untuk testing dan track ID untuk cleanup
   * @param userData - Data user yang akan dibuat
   * @returns Created user object
   */
  async createTestUser(userData: Partial<NewUser> = {}): Promise<User> {
    const defaultUser: NewUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      passwordHash: 'hashed_password',
      department: 'Engineering',
      region: 'Jakarta',
      level: 5,
      ...userData
    }

    const user = await this.repository.INSERT.One(defaultUser)
    this.createdUserIds.push(user.id)
    return user
  }

  /**
   * Cleanup semua test data yang dibuat
   * Dipanggil di afterEach untuk memastikan database bersih
   */
  async cleanup(): Promise<void> {
    for (const id of this.createdUserIds) {
      try {
        await this.repository.DELETE.One(id)
      } catch (error) {
        console.warn(`Failed to cleanup user ${id}:`, error)
      }
    }
    this.createdUserIds = []
  }

  /**
   * Get repository instance untuk testing
   * @returns Repository instance
   */
  getRepository() {
    return this.repository
  }
}

/**
 * Integration Tests untuk Users Service GET Operations
 * Testing operasi SELECT dengan database sesungguhnya
 */
describe('Users Service - GET Operations Integration Tests', () => {
  let usersService: Service<typeof users>
  let testHelper: ServiceTestHelper

  /**
   * Setup untuk setiap test case
   * Create fresh service instance dengan real repository
   */
  beforeEach(() => {
    testHelper = new ServiceTestHelper()
    
    // Create service instance dengan real repository
    usersService = new Service(testHelper.getRepository(), {
      enableLogging: false,
      enableValidation: true
    })
  })

  /**
   * Cleanup setelah setiap test case
   * Memastikan database bersih untuk test berikutnya
   */
  afterEach(async () => {
    await testHelper.cleanup()
  })

  describe('GET Operations - Integration', () => {
    it('harus dapat mengambil semua users dari database', async () => {
      // Arrange - Create test data
      await testHelper.createTestUser({ name: 'User 1', email: 'user1@test.com' })
      await testHelper.createTestUser({ name: 'User 2', email: 'user2@test.com' })
      console.log('Created test users for integration test')

      // Act
      const result = await usersService.GET.All()
      console.log('Integration test - GET All result:', result)

      // Assert
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThanOrEqual(2)
      
      // Verify our test users exist
      const testUsers = result.filter(u => u.email.includes('@test.com'))
      expect(testUsers.length).toBeGreaterThanOrEqual(1)
    })

    it('harus dapat mengambil user berdasarkan ID dari database', async () => {
      // Arrange
      const testUser = await testHelper.createTestUser({ 
        name: 'Integration Test User',
        email: 'integration@test.com'
      })

      // Act
      const result = await usersService.GET.ById(testUser.id)
      console.log('Integration test - GET ById result:', result)

      // Assert
      expect(result).toBeDefined()
      expect(result).not.toBeNull()
      expect(result!.id).toBe(testUser.id)
      expect(result!.name).toBe('Integration Test User')
      expect(result!.email).toBe('integration@test.com')
    })

    it('harus mengembalikan null untuk ID yang tidak ada', async () => {
      // Act
      const result = await usersService.GET.ById(999999)

      // Assert
      expect(result).toBeNull()
    })
  })
})