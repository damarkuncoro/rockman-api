// rockman-app/src/test/endpoints/users/users.endpoint.post.test.ts
/**
 * Endpoint Tests untuk Users API - POST Operations
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
}

/**
 * Endpoint Tests untuk Users API - POST Operations
 * Testing HTTP endpoints dengan real server
 */
describe('Users API Endpoints - POST Operations', () => {
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

  describe('POST /api/v1/users', () => {
    it('harus berhasil membuat user baru dengan data valid', async () => {
      // Arrange
      const userData = testHelper.createUserData({
        name: 'John Doe',
        email: 'john.doe@example.com',
        department: 'Engineering',
        region: 'Jakarta',
        level: 5
      })

      // Act
      const response = await testHelper.postEndpoint('/users', userData)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(201)
      expect(response.headers.get('content-type')).toContain('application/json')
      expect(data).toHaveProperty('id')
      expect(data.name).toBe('John Doe')
      expect(data.email).toBe('john.doe@example.com')
      expect(data.department).toBe('Engineering')
      expect(data.region).toBe('Jakarta')
      expect(data.level).toBe(5)
      expect(data).toHaveProperty('createdAt')
      expect(data).toHaveProperty('updatedAt')

      // Track untuk cleanup
      testHelper.trackUserId(data.id)
    })

    it('harus berhasil membuat user dengan data minimal', async () => {
      // Arrange
      const userData = testHelper.createUserData({
        name: 'Minimal User',
        email: 'minimal@example.com'
      })

      // Act
      const response = await testHelper.postEndpoint('/users', userData)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(201)
      expect(data).toHaveProperty('id')
      expect(data.name).toBe('Minimal User')
      expect(data.email).toBe('minimal@example.com')

      // Track untuk cleanup
      testHelper.trackUserId(data.id)
    })

    it('harus mengembalikan error 500 untuk data tidak valid', async () => {
      // Arrange - Data tanpa field required
      const invalidData = {
        name: 'Test User'
        // Missing email dan passwordHash
      }

      // Act
      const response = await testHelper.postEndpoint('/users', invalidData)

      // Assert
      expect(response.status).toBe(500)
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        expect(data).toHaveProperty('error')
      }
    })

    it('harus mengembalikan error untuk email duplicate', async () => {
      // Arrange - Create user pertama
      const userData1 = testHelper.createUserData({
        email: 'duplicate@example.com'
      })
      
      const response1 = await testHelper.postEndpoint('/users', userData1)
      const data1 = await response1.json()
      testHelper.trackUserId(data1.id)

      // Arrange - Create user kedua dengan email sama
      const userData2 = testHelper.createUserData({
        email: 'duplicate@example.com' // Email sama
      })

      // Act
      const response2 = await testHelper.postEndpoint('/users', userData2)

      // Assert
      expect(response2.status).toBe(500)
      
      if (response2.headers.get('content-type')?.includes('application/json')) {
        const data2 = await response2.json()
        expect(data2).toHaveProperty('error')
      }
    })

    it('harus mengembalikan error untuk request body kosong', async () => {
      // Act
      const response = await testHelper.postEndpoint('/users', {})

      // Assert
      expect(response.status).toBe(500)
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        expect(data).toHaveProperty('error')
      }
    })

    it('harus mengembalikan error untuk invalid JSON', async () => {
      // Act - Send invalid JSON
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json'
      })

      // Assert
      expect(response.status).toBe(400)
    })
  })
})