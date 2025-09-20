// rockman-app/src/test/endpoints/users/users.endpoint.delete-id.test.ts
/**
 * Endpoint Tests untuk Users API - DELETE by ID Operations
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
   * Remove user ID from tracking (karena sudah dihapus)
   * @param id - User ID yang akan di-remove dari tracking
   */
  untrackUserId(id: number): void {
    const index = this.createdUserIds.indexOf(id)
    if (index > -1) {
      this.createdUserIds.splice(index, 1)
    }
  }

  /**
   * Helper untuk melakukan HTTP DELETE request by ID
   * @param id - User ID yang akan di-delete
   * @returns Promise<Response> - Response dari server
   */
  async deleteEndpointById(id: number): Promise<Response> {
    return fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }

  /**
   * Helper untuk melakukan HTTP GET request by ID
   * @param id - User ID yang akan di-get
   * @returns Promise<Response> - Response dari server
   */
  async getEndpointById(id: number): Promise<Response> {
    return fetch(`${BASE_URL}/users/${id}`, {
      method: 'GET',
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
}

/**
 * Endpoint Tests untuk Users API - DELETE by ID Operations
 * Testing HTTP endpoints dengan real server
 */
describe('Users API Endpoints - DELETE by ID Operations', () => {
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

  describe('DELETE /api/v1/users/[id]', () => {
    it('harus berhasil menghapus user berdasarkan ID yang valid', async () => {
      // Arrange - Create test user
      const createdUser = await testHelper.createTestUser({
        name: 'Delete Test User',
        email: 'delete@example.com',
        department: 'Engineering',
        region: 'Jakarta',
        level: 5
      })

      // Verify user exists
      const beforeResponse = await testHelper.getEndpointById(createdUser.id)
      expect(beforeResponse.status).toBe(200)

      // Act
      const response = await testHelper.deleteEndpointById(createdUser.id)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('application/json')
      expect(data).toHaveProperty('message')
      expect(data.message).toContain('deleted')
      expect(data).toHaveProperty('id', createdUser.id)

      // Verify user is deleted
      const afterResponse = await testHelper.getEndpointById(createdUser.id)
      expect(afterResponse.status).toBe(404)

      // Untrack karena sudah dihapus
      testHelper.untrackUserId(createdUser.id)
    })

    it('harus mengembalikan error 404 untuk ID yang tidak ada', async () => {
      // Arrange - Use non-existent ID
      const nonExistentId = 999999

      // Act
      const response = await testHelper.deleteEndpointById(nonExistentId)

      // Assert
      expect(response.status).toBe(404)
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        expect(data).toHaveProperty('error')
        expect(data.error).toContain('not found')
      }
    })

    it('harus mengembalikan error 400 untuk ID yang tidak valid', async () => {
      // Act - Test dengan ID yang tidak valid (string)
      const response = await fetch(`${BASE_URL}/users/invalid-id`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      // Assert
      expect(response.status).toBe(400)
    })

    it('harus mengembalikan error 400 untuk ID negatif', async () => {
      // Act
      const response = await testHelper.deleteEndpointById(-1)

      // Assert
      expect(response.status).toBe(400)
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        expect(data).toHaveProperty('error')
      }
    })

    it('harus mengembalikan error 400 untuk ID zero', async () => {
      // Act
      const response = await testHelper.deleteEndpointById(0)

      // Assert
      expect(response.status).toBe(400)
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        expect(data).toHaveProperty('error')
      }
    })

    it('harus mengembalikan error 404 untuk double delete', async () => {
      // Arrange - Create and delete user
      const createdUser = await testHelper.createTestUser({
        name: 'Double Delete User',
        email: 'doubledelete@example.com'
      })

      // First delete
      const firstResponse = await testHelper.deleteEndpointById(createdUser.id)
      expect(firstResponse.status).toBe(200)
      testHelper.untrackUserId(createdUser.id)

      // Act - Second delete
      const secondResponse = await testHelper.deleteEndpointById(createdUser.id)

      // Assert
      expect(secondResponse.status).toBe(404)
      
      if (secondResponse.headers.get('content-type')?.includes('application/json')) {
        const data = await secondResponse.json()
        expect(data).toHaveProperty('error')
        expect(data.error).toContain('not found')
      }
    })

    it('harus menghapus user dengan data lengkap dengan benar', async () => {
      // Arrange - Create user dengan data lengkap
      const createdUser = await testHelper.createTestUser({
        name: 'Complete Delete User',
        email: 'completedelete@example.com',
        department: 'Technology',
        region: 'Bandung',
        level: 8
      })

      // Act
      const response = await testHelper.deleteEndpointById(createdUser.id)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('message')
      expect(data).toHaveProperty('id', createdUser.id)

      // Verify user is completely deleted
      const getResponse = await testHelper.getEndpointById(createdUser.id)
      expect(getResponse.status).toBe(404)

      testHelper.untrackUserId(createdUser.id)
    })

    it('harus menangani concurrent delete operations untuk user yang berbeda', async () => {
      // Arrange - Create multiple users
      const user1 = await testHelper.createTestUser({
        name: 'Concurrent User 1',
        email: 'concurrent1@example.com'
      })
      const user2 = await testHelper.createTestUser({
        name: 'Concurrent User 2',
        email: 'concurrent2@example.com'
      })
      const user3 = await testHelper.createTestUser({
        name: 'Concurrent User 3',
        email: 'concurrent3@example.com'
      })

      // Act - Concurrent delete operations
      const promises = [
        testHelper.deleteEndpointById(user1.id),
        testHelper.deleteEndpointById(user2.id),
        testHelper.deleteEndpointById(user3.id)
      ]

      const responses = await Promise.all(promises)
      const dataArray = await Promise.all(responses.map(r => r.json()))

      // Assert - All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })

      dataArray.forEach((data, index) => {
        expect(data).toHaveProperty('message')
        expect(data).toHaveProperty('id')
      })

      // Verify all users are deleted
      const getResponses = await Promise.all([
        testHelper.getEndpointById(user1.id),
        testHelper.getEndpointById(user2.id),
        testHelper.getEndpointById(user3.id)
      ])

      getResponses.forEach(response => {
        expect(response.status).toBe(404)
      })

      // Untrack all
      testHelper.untrackUserId(user1.id)
      testHelper.untrackUserId(user2.id)
      testHelper.untrackUserId(user3.id)
    })

    it('harus mengembalikan response yang konsisten', async () => {
      // Arrange - Create test user
      const createdUser = await testHelper.createTestUser({
        name: 'Consistent Delete User',
        email: 'consistentdelete@example.com'
      })

      // Act
      const response = await testHelper.deleteEndpointById(createdUser.id)
      const data = await response.json()

      // Assert response structure
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('application/json')
      expect(data).toHaveProperty('message')
      expect(data).toHaveProperty('id')
      expect(typeof data.message).toBe('string')
      expect(typeof data.id).toBe('number')
      expect(data.id).toBe(createdUser.id)

      testHelper.untrackUserId(createdUser.id)
    })

    it('harus menangani delete user yang baru saja dibuat', async () => {
      // Arrange - Create user
      const createdUser = await testHelper.createTestUser({
        name: 'Fresh Delete User',
        email: 'freshdelete@example.com'
      })

      // Act - Immediately delete
      const response = await testHelper.deleteEndpointById(createdUser.id)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('id', createdUser.id)

      // Verify deletion
      const getResponse = await testHelper.getEndpointById(createdUser.id)
      expect(getResponse.status).toBe(404)

      testHelper.untrackUserId(createdUser.id)
    })
  })
})