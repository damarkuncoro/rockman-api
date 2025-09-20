// rockman-app/src/test/services/users/integration/users.service.error.integration.test.ts
/**
 * Integration Tests untuk Users Service Error Handling dengan Real Repository
 * Fokus pada testing error handling dengan database real
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

  /**
   * Track user ID untuk cleanup (untuk akses dari test)
   * @param id - User ID yang akan di-track
   */
  trackUserId(id: number): void {
    this.createdUserIds.push(id)
  }
}

/**
 * Integration Tests untuk Users Service Error Handling
 * Testing error handling dengan database sesungguhnya
 */
describe('Users Service - Error Handling Integration Tests', () => {
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

  describe('Error Handling - Integration', () => {
    it('harus menangani error database dengan proper', async () => {
      // Arrange - Try to create user with duplicate email
      const userData: NewUser = {
        name: 'Test User',
        email: 'duplicate@test.com',
        passwordHash: 'hashed_password',
        department: 'Engineering',
        region: 'Jakarta',
        level: 5
      }

      // Create first user
      const firstUser = await usersService.POST.Create(userData)
      testHelper.trackUserId(firstUser.id)

      // Act & Assert - Try to create duplicate
      await expect(usersService.POST.Create(userData)).rejects.toThrow()
    })
  })
})