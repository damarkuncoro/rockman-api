// rockman-app/src/test/services/users/integration/users.service.config.integration.test.ts
/**
 * Integration Tests untuk Users Service Configuration dengan Real Repository
 * Fokus pada testing konfigurasi service dengan database real
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
 * Integration Tests untuk Users Service Configuration
 * Testing berbagai konfigurasi service dengan database sesungguhnya
 */
describe('Users Service - Configuration Integration Tests', () => {
  let testHelper: ServiceTestHelper

  /**
   * Setup untuk setiap test case
   * Create fresh test helper instance
   */
  beforeEach(() => {
    testHelper = new ServiceTestHelper()
  })

  /**
   * Cleanup setelah setiap test case
   * Memastikan database bersih untuk test berikutnya
   */
  afterEach(async () => {
    await testHelper.cleanup()
  })

  describe('Service Configuration - Integration', () => {
    it('harus bekerja dengan konfigurasi logging enabled', async () => {
      // Arrange
      const serviceWithLogging = new Service(testHelper.getRepository(), {
        enableLogging: true,
        enableValidation: true
      })

      const testUser = await testHelper.createTestUser()

      // Act & Assert - Should not throw
      const result = await serviceWithLogging.GET.ById(testUser.id)
      console.log('Integration test - GET ById result:', result)
      expect(result).toBeDefined()
      expect(result!.id).toBe(testUser.id)
    })
  })
})