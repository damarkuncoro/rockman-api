// rockman-app/src/test/endpoints/users/users.endpoint.delete.test.ts
/**
 * Endpoint Tests untuk Users API - DELETE Operations
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
   * Track user ID untuk cleanup
   * @param id - User ID yang akan di-track
   */
  trackUserId(id: number): void {
    this.createdUserIds.push(id)
  }

  /**
   * Helper untuk melakukan HTTP DELETE request
   * @param endpoint - Endpoint yang akan di-test
   * @returns Promise<Response> - Response dari server
   */
  async deleteEndpoint(endpoint: string): Promise<Response> {
    return fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }

  /**
   * Helper untuk melakukan HTTP POST request
   * @param endpoint - Endpoint yang akan di-test
   * @param data - Data yang akan dikirim
   * @returns Promise<Response> - Response dari server
   */
  async postEndpoint(endpoint: string, data: any): Promise<Response> {
    return fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
  }

  /**
   * Helper untuk melakukan HTTP GET request
   * @param endpoint - Endpoint yang akan di-test
   * @returns Promise<Response> - Response dari server
   */
  async getEndpoint(endpoint: string): Promise<Response> {
    return fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }

  /**
   * Membuat data user untuk testing
   * @param overrides - Data yang akan di-override
   * @returns NewUser - Data user untuk testing
   */
  createUserData(overrides?: Partial<NewUser>): NewUser {
    return {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      passwordHash: 'hashed_password',
      department: 'Engineering',
      region: 'Jakarta',
      level: 5,
      ...overrides
    }
  }

  /**
   * Membuat user untuk testing dan track ID-nya
   * @param userData - Data user yang akan dibuat
   * @returns Promise<User> - User yang telah dibuat
   */
  async createTestUser(userData?: Partial<NewUser>): Promise<User> {
    const data = this.createUserData(userData)
    const response = await this.postEndpoint('/users', data)
    const user = await response.json()
    this.trackUserId(user.id)
    return user
  }

  /**
   * Membuat multiple users untuk testing
   * @param count - Jumlah users yang akan dibuat
   * @returns Promise<User[]> - Array users yang telah dibuat
   */
  async createMultipleTestUsers(count: number): Promise<User[]> {
    const users: User[] = []
    for (let i = 0; i < count; i++) {
      const user = await this.createTestUser({
        name: `Test User ${i + 1}`,
        email: `testuser${i + 1}${Date.now()}@example.com`
      })
      users.push(user)
    }
    return users
  }
}

/**
 * Endpoint Tests untuk Users API - DELETE Operations
 * Testing HTTP endpoints dengan real server
 */
describe('Users API Endpoints - DELETE Operations', () => {
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

  describe('DELETE /api/v1/users', () => {
    it('harus berhasil menghapus semua users', async () => {
      // Arrange - Create test users
      await testHelper.createMultipleTestUsers(3)

      // Verify users exist
      const beforeResponse = await testHelper.getEndpoint('/users')
      const beforeData = await beforeResponse.json()
      expect(beforeData.length).toBeGreaterThanOrEqual(3)

      // Act
      const response = await testHelper.deleteEndpoint('/users')
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('application/json')
      expect(data).toHaveProperty('message')
      expect(data.message).toContain('deleted')
      expect(data).toHaveProperty('count')
      expect(data.count).toBeGreaterThanOrEqual(3)

      // Verify users are deleted
      const afterResponse = await testHelper.getEndpoint('/users')
      const afterData = await afterResponse.json()
      expect(afterData.length).toBe(0)
    })

    it('harus berhasil meskipun tidak ada users untuk dihapus', async () => {
      // Arrange - Tidak ada users yang dibuat
      
      // Act
      const response = await testHelper.deleteEndpoint('/users')
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('message')
      expect(data).toHaveProperty('count')
      expect(data.count).toBe(0)
    })

    it('harus menghapus users dengan benar dan mengembalikan count yang tepat', async () => {
      // Arrange - Create specific number of users
      const userCount = 5
      await testHelper.createMultipleTestUsers(userCount)

      // Verify initial count
      const beforeResponse = await testHelper.getEndpoint('/users')
      const beforeData = await beforeResponse.json()
      expect(beforeData.length).toBeGreaterThanOrEqual(userCount)

      // Act
      const response = await testHelper.deleteEndpoint('/users')
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('count')
      expect(data.count).toBeGreaterThanOrEqual(userCount)

      // Verify all users are deleted
      const afterResponse = await testHelper.getEndpoint('/users')
      const afterData = await afterResponse.json()
      expect(afterData.length).toBe(0)
    })

    it('harus menangani multiple delete operations dengan benar', async () => {
      // Arrange - Create users
      await testHelper.createMultipleTestUsers(2)

      // Act - First delete
      const response1 = await testHelper.deleteEndpoint('/users')
      const data1 = await response1.json()

      // Assert first delete
      expect(response1.status).toBe(200)
      expect(data1.count).toBeGreaterThanOrEqual(2)

      // Act - Second delete (should delete nothing)
      const response2 = await testHelper.deleteEndpoint('/users')
      const data2 = await response2.json()

      // Assert second delete
      expect(response2.status).toBe(200)
      expect(data2.count).toBe(0)
    })

    it('harus mengembalikan response yang konsisten', async () => {
      // Arrange - Create test user
      await testHelper.createTestUser({
        name: 'Delete Test User',
        email: 'deletetest@example.com'
      })

      // Act
      const response = await testHelper.deleteEndpoint('/users')
      const data = await response.json()

      // Assert response structure
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('application/json')
      expect(data).toHaveProperty('message')
      expect(data).toHaveProperty('count')
      expect(typeof data.message).toBe('string')
      expect(typeof data.count).toBe('number')
      expect(data.count).toBeGreaterThanOrEqual(0)
    })

    it('harus menangani concurrent delete operations', async () => {
      // Arrange - Create users
      await testHelper.createMultipleTestUsers(3)

      // Act - Concurrent delete operations
      const promises = [
        testHelper.deleteEndpoint('/users'),
        testHelper.deleteEndpoint('/users'),
        testHelper.deleteEndpoint('/users')
      ]

      const responses = await Promise.all(promises)
      const dataArray = await Promise.all(responses.map(r => r.json()))

      // Assert - All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })

      // At least one should have deleted users
      const totalDeleted = dataArray.reduce((sum, data) => sum + data.count, 0)
      expect(totalDeleted).toBeGreaterThanOrEqual(3)

      // Verify all users are deleted
      const afterResponse = await testHelper.getEndpoint('/users')
      const afterData = await afterResponse.json()
      expect(afterData.length).toBe(0)
    })
  })
})