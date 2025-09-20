// rockman-app/src/test/services/users/integration/users.service.put.integration.test.ts
/**
 * Integration Tests untuk Users Service PUT Operations dengan Real Repository
 * Fokus pada testing operasi PUT (UPDATE) dengan database real
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
 * Integration Tests untuk Users Service PUT Operations
 * Testing operasi UPDATE dengan database sesungguhnya
 */
describe('Users Service - PUT Operations Integration Tests', () => {
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

  describe('PUT Operations - Integration', () => {
    it('harus dapat mengupdate user di database', async () => {
      // Arrange
      const testUser = await testHelper.createTestUser({
        name: 'Original Name',
        level: 3
      })
      
      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const updateData = { name: 'Updated Name', level: 5 }

      // Act
      const result = await usersService.PUT.Update(testUser.id, updateData)
      console.log('Integration test - PUT Update result:', result)
      
      // Assert
      expect(result).toBeDefined()
      expect(result!.id).toBe(testUser.id)
      expect(result!.name).toBe('Updated Name')
      expect(result!.level).toBe(5)
      expect(result!.updatedAt.getTime()).toBeGreaterThanOrEqual(testUser.updatedAt.getTime())
    })
  })
})