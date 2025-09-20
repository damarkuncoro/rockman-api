// rockman-app/src/test/endpoints/users/users.endpoint.put.test.ts
/**
 * Endpoint Tests untuk Users API - PUT Operations
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
   * Helper untuk melakukan HTTP PUT request
   * @param endpoint - Endpoint yang akan di-test
   * @param data - Data yang akan dikirim
   * @returns Promise<Response> - Response dari server
   */
  async putEndpoint(endpoint: string, data: any): Promise<Response> {
    return fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
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
 * Endpoint Tests untuk Users API - PUT Operations
 * Testing HTTP endpoints dengan real server
 */
describe('Users API Endpoints - PUT Operations', () => {
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

  describe('PUT /api/v1/users', () => {
    it('harus berhasil update semua users dengan data valid', async () => {
      // Arrange - Create test users
      const user1 = await testHelper.createTestUser({
        name: 'User 1',
        email: 'user1@example.com'
      })
      const user2 = await testHelper.createTestUser({
        name: 'User 2',
        email: 'user2@example.com'
      })

      const updateData = {
        department: 'Updated Department',
        region: 'Updated Region',
        level: 10
      }

      // Act
      const response = await testHelper.putEndpoint('/users', updateData)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('application/json')
      expect(data).toHaveProperty('message')
      expect(data.message).toContain('updated')
      expect(data).toHaveProperty('count')
      expect(data.count).toBeGreaterThanOrEqual(2)
    })

    it('harus berhasil update dengan partial data', async () => {
      // Arrange - Create test user
      await testHelper.createTestUser({
        name: 'Test User',
        department: 'Engineering'
      })

      const updateData = {
        level: 8
      }

      // Act
      const response = await testHelper.putEndpoint('/users', updateData)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('message')
      expect(data).toHaveProperty('count')
      expect(data.count).toBeGreaterThanOrEqual(1)
    })

    it('harus berhasil meskipun tidak ada users untuk di-update', async () => {
      // Arrange - Tidak ada users yang dibuat
      const updateData = {
        department: 'New Department'
      }

      // Act
      const response = await testHelper.putEndpoint('/users', updateData)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('message')
      expect(data).toHaveProperty('count')
      expect(data.count).toBe(0)
    })

    it('harus mengembalikan error untuk data tidak valid', async () => {
      // Arrange - Data dengan field yang tidak valid
      const invalidData = {
        invalidField: 'invalid value',
        level: 'not a number' // Level harus number
      }

      // Act
      const response = await testHelper.putEndpoint('/users', invalidData)

      // Assert
      expect(response.status).toBe(500)
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        expect(data).toHaveProperty('error')
      }
    })

    it('harus mengembalikan error untuk request body kosong', async () => {
      // Act
      const response = await testHelper.putEndpoint('/users', {})

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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json'
      })

      // Assert
      expect(response.status).toBe(400)
    })

    it('harus update users dengan data kompleks', async () => {
      // Arrange - Create multiple test users
      await testHelper.createTestUser({
        name: 'User A',
        department: 'Engineering',
        region: 'Jakarta',
        level: 5
      })
      await testHelper.createTestUser({
        name: 'User B',
        department: 'Marketing',
        region: 'Surabaya',
        level: 3
      })

      const updateData = {
        department: 'Technology',
        region: 'Bandung',
        level: 7,
        updatedAt: new Date().toISOString()
      }

      // Act
      const response = await testHelper.putEndpoint('/users', updateData)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('message')
      expect(data).toHaveProperty('count')
      expect(data.count).toBeGreaterThanOrEqual(2)
    })
  })
})