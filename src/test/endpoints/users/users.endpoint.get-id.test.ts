// rockman-app/src/test/endpoints/users/users.endpoint.get-id.test.ts
/**
 * Endpoint Tests untuk Users API - GET by ID Operations
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
 * Endpoint Tests untuk Users API - GET by ID Operations
 * Testing HTTP endpoints dengan real server
 */
describe('Users API Endpoints - GET by ID Operations', () => {
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

  describe('GET /api/v1/users/[id]', () => {
    it('harus berhasil mendapatkan user berdasarkan ID yang valid', async () => {
      // Arrange - Create test user
      const createdUser = await testHelper.createTestUser({
        name: 'John Doe',
        email: 'john.doe@example.com',
        department: 'Engineering',
        region: 'Jakarta',
        level: 5
      })

      // Act
      const response = await testHelper.getEndpointById(createdUser.id)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('application/json')
      expect(data).toHaveProperty('id', createdUser.id)
      expect(data).toHaveProperty('name', 'John Doe')
      expect(data).toHaveProperty('email', 'john.doe@example.com')
      expect(data).toHaveProperty('department', 'Engineering')
      expect(data).toHaveProperty('region', 'Jakarta')
      expect(data).toHaveProperty('level', 5)
      expect(data).toHaveProperty('createdAt')
      expect(data).toHaveProperty('updatedAt')
      expect(data).not.toHaveProperty('passwordHash') // Password tidak boleh di-return
    })

    it('harus mengembalikan error 404 untuk ID yang tidak ada', async () => {
      // Arrange - Use non-existent ID
      const nonExistentId = 999999

      // Act
      const response = await testHelper.getEndpointById(nonExistentId)

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
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      // Assert
      expect(response.status).toBe(400)
    })

    it('harus mengembalikan error 400 untuk ID negatif', async () => {
      // Act
      const response = await testHelper.getEndpointById(-1)

      // Assert
      expect(response.status).toBe(400)
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        expect(data).toHaveProperty('error')
      }
    })

    it('harus mengembalikan error 400 untuk ID zero', async () => {
      // Act
      const response = await testHelper.getEndpointById(0)

      // Assert
      expect(response.status).toBe(400)
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        expect(data).toHaveProperty('error')
      }
    })

    it('harus mengembalikan user dengan semua field yang benar', async () => {
      // Arrange - Create user dengan data lengkap
      const userData = {
        name: 'Complete User',
        email: 'complete@example.com',
        department: 'Technology',
        region: 'Bandung',
        level: 8
      }
      const createdUser = await testHelper.createTestUser(userData)

      // Act
      const response = await testHelper.getEndpointById(createdUser.id)
      const data = await response.json()

      // Assert - Verify all fields
      expect(data.id).toBe(createdUser.id)
      expect(data.name).toBe(userData.name)
      expect(data.email).toBe(userData.email)
      expect(data.department).toBe(userData.department)
      expect(data.region).toBe(userData.region)
      expect(data.level).toBe(userData.level)
      expect(typeof data.createdAt).toBe('string')
      expect(typeof data.updatedAt).toBe('string')
      expect(new Date(data.createdAt)).toBeInstanceOf(Date)
      expect(new Date(data.updatedAt)).toBeInstanceOf(Date)
    })

    it('harus mengembalikan user yang baru saja dibuat', async () => {
      // Arrange - Create user
      const createdUser = await testHelper.createTestUser({
        name: 'Fresh User',
        email: 'fresh@example.com'
      })

      // Act - Immediately get the user
      const response = await testHelper.getEndpointById(createdUser.id)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.id).toBe(createdUser.id)
      expect(data.name).toBe('Fresh User')
      expect(data.email).toBe('fresh@example.com')
    })

    it('harus menangani multiple concurrent requests untuk ID yang sama', async () => {
      // Arrange - Create test user
      const createdUser = await testHelper.createTestUser({
        name: 'Concurrent User',
        email: 'concurrent@example.com'
      })

      // Act - Multiple concurrent requests
      const promises = [
        testHelper.getEndpointById(createdUser.id),
        testHelper.getEndpointById(createdUser.id),
        testHelper.getEndpointById(createdUser.id)
      ]

      const responses = await Promise.all(promises)
      const dataArray = await Promise.all(responses.map(r => r.json()))

      // Assert - All should succeed and return same data
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })

      dataArray.forEach(data => {
        expect(data.id).toBe(createdUser.id)
        expect(data.name).toBe('Concurrent User')
        expect(data.email).toBe('concurrent@example.com')
      })
    })

    it('harus mengembalikan response yang konsisten untuk user yang sama', async () => {
      // Arrange - Create test user
      const createdUser = await testHelper.createTestUser({
        name: 'Consistent User',
        email: 'consistent@example.com'
      })

      // Act - Multiple requests dengan delay
      const response1 = await testHelper.getEndpointById(createdUser.id)
      const data1 = await response1.json()

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 100))

      const response2 = await testHelper.getEndpointById(createdUser.id)
      const data2 = await response2.json()

      // Assert - Data should be identical
      expect(response1.status).toBe(200)
      expect(response2.status).toBe(200)
      expect(data1).toEqual(data2)
    })
  })
})