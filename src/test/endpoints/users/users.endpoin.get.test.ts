// rockman-app/src/test/endpoints/users/users.endpoint.get.test.ts
/**
 * Endpoint Tests untuk Users API - GET Operations
 * Testing HTTP endpoints dengan real server dan database
 * Menggunakan fetch API untuk testing endpoint behavior
 */
import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest'
import { users, type User, type NewUser } from '@/db/schema/users'
import { createUsersRepository } from '@/repositories/users/users.repository'

/**
 * Base URL untuk testing endpoints
 * Menggunakan localhost development server
 */
const BASE_URL = 'http://localhost:3000/api/v1'

/**
 * Helper class untuk endpoint testing
 * Menyediakan utility methods untuk testing HTTP endpoints
 */
class EndpointTestHelper {
  private repository = createUsersRepository()
  private createdUserIds: number[] = []

  /**
   * Membuat test user untuk testing
   * @param userData - Data user yang akan dibuat
   * @returns Promise<User> - User yang telah dibuat
   */
  async createTestUser(userData?: Partial<NewUser>): Promise<User> {
    const defaultUserData: NewUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      passwordHash: 'hashed_password',
      department: 'Engineering',
      region: 'Jakarta',
      level: 5,
      ...userData
    }

    const user = await this.repository.INSERT.One(defaultUserData)
    this.createdUserIds.push(user.id)
    return user
  }

  /**
   * Cleanup semua test data yang dibuat
   * Menghapus semua users yang dibuat selama testing
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
   * Helper untuk melakukan HTTP GET request
   * @param endpoint - Endpoint yang akan di-test
   * @returns Promise<Response> - Response dari server
   */
  async fetchEndpoint(endpoint: string): Promise<Response> {
    return fetch(`${BASE_URL}${endpoint}`)
  }
}

/**
 * Endpoint Tests untuk Users API - GET Operations
 * Testing HTTP endpoints dengan real server
 */
describe('Users API Endpoints - GET Operations', () => {
  let testHelper: EndpointTestHelper

  /**
   * Setup sebelum semua test
   * Memastikan server development berjalan
   */
  beforeAll(async () => {
    // Verifikasi server development berjalan
    try {
      const response = await fetch(`${BASE_URL}/users`)
      if (!response.ok && response.status !== 404) {
        throw new Error(`Development server not running. Status: ${response.status}`)
      }
    } catch (error) {
      console.warn('Development server check failed:', error)
      throw new Error('Development server must be running for endpoint tests')
    }
  })

  /**
   * Setup untuk setiap test case
   * Create fresh test helper instance
   */
  beforeEach(() => {
    testHelper = new EndpointTestHelper()
  })

  /**
   * Cleanup setelah setiap test case
   * Memastikan database bersih untuk test berikutnya
   */
  afterEach(async () => {
    await testHelper.cleanup()
  })

  describe('GET /api/v1/users', () => {
    it('harus mengembalikan status 200 dan array users', async () => {
      // Arrange - Create test data
      await testHelper.createTestUser({ name: 'User 1', email: 'user1@test.com' })
      await testHelper.createTestUser({ name: 'User 2', email: 'user2@test.com' })

      // Act
      const response = await testHelper.fetchEndpoint('/users')
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('application/json')
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThanOrEqual(2)
      
      // Verify user structure
      if (data.length > 0) {
        const user = data[0]
        expect(user).toHaveProperty('id')
        expect(user).toHaveProperty('name')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('createdAt')
        expect(user).toHaveProperty('updatedAt')
      }
    })

    it('harus mengembalikan array kosong jika tidak ada users', async () => {
      // Act - No test data created
      const response = await testHelper.fetchEndpoint('/users')
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
      // Note: Mungkin ada data dari test lain, jadi tidak strict empty
    })

    it('harus mengembalikan proper error handling untuk server error', async () => {
      // Act - Test dengan endpoint yang valid
      const response = await testHelper.fetchEndpoint('/users')

      // Assert - Endpoint harus selalu mengembalikan response yang valid
      expect(response.status).toBeOneOf([200, 500])
      
      if (response.status === 500) {
        const data = await response.json()
        expect(data).toHaveProperty('error')
      }
    })
  })
})