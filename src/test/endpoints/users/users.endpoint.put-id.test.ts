// rockman-app/src/test/endpoints/users/users.endpoint.put-id.test.ts
/**
 * Endpoint Tests untuk Users API - PUT by ID Operations
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
   * Helper untuk melakukan HTTP PUT request by ID
   * @param id - User ID yang akan di-update
   * @param data - Data yang akan dikirim
   * @returns Promise<Response> - Response dari server
   */
  async putEndpointById(id: number, data: any): Promise<Response> {
    return fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
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
 * Endpoint Tests untuk Users API - PUT by ID Operations
 * Testing HTTP endpoints dengan real server
 */
describe('Users API Endpoints - PUT by ID Operations', () => {
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

  describe('PUT /api/v1/users/[id]', () => {
    it('harus berhasil update user berdasarkan ID dengan data lengkap', async () => {
      // Arrange - Create test user
      const createdUser = await testHelper.createTestUser({
        name: 'Original User',
        email: 'original@example.com',
        department: 'Engineering',
        region: 'Jakarta',
        level: 5
      })

      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com',
        department: 'Technology',
        region: 'Bandung',
        level: 8
      }

      // Act
      const response = await testHelper.putEndpointById(createdUser.id, updateData)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('application/json')
      expect(data).toHaveProperty('id', createdUser.id)
      expect(data).toHaveProperty('name', 'Updated User')
      expect(data).toHaveProperty('email', 'updated@example.com')
      expect(data).toHaveProperty('department', 'Technology')
      expect(data).toHaveProperty('region', 'Bandung')
      expect(data).toHaveProperty('level', 8)
      expect(data).toHaveProperty('updatedAt')

      // Verify update dengan GET
      const getResponse = await testHelper.getEndpointById(createdUser.id)
      const getData = await getResponse.json()
      expect(getData.name).toBe('Updated User')
      expect(getData.email).toBe('updated@example.com')
    })

    it('harus berhasil update user dengan partial data', async () => {
      // Arrange - Create test user
      const createdUser = await testHelper.createTestUser({
        name: 'Partial User',
        email: 'partial@example.com',
        department: 'Engineering',
        level: 5
      })

      const updateData = {
        level: 10
      }

      // Act
      const response = await testHelper.putEndpointById(createdUser.id, updateData)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('id', createdUser.id)
      expect(data).toHaveProperty('level', 10)
      expect(data).toHaveProperty('name', 'Partial User') // Should remain unchanged
      expect(data).toHaveProperty('email', 'partial@example.com') // Should remain unchanged

      // Verify dengan GET
      const getResponse = await testHelper.getEndpointById(createdUser.id)
      const getData = await getResponse.json()
      expect(getData.level).toBe(10)
      expect(getData.name).toBe('Partial User')
    })

    it('harus mengembalikan error 404 untuk ID yang tidak ada', async () => {
      // Arrange - Use non-existent ID
      const nonExistentId = 999999
      const updateData = {
        name: 'Non Existent User'
      }

      // Act
      const response = await testHelper.putEndpointById(nonExistentId, updateData)

      // Assert
      expect(response.status).toBe(404)
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        expect(data).toHaveProperty('error')
        expect(data.error).toContain('not found')
      }
    })

    it('harus mengembalikan error 400 untuk ID yang tidak valid', async () => {
      // Arrange
      const updateData = {
        name: 'Invalid ID User'
      }

      // Act - Test dengan ID yang tidak valid (string)
      const response = await fetch(`${BASE_URL}/users/invalid-id`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      // Assert
      expect(response.status).toBe(400)
    })

    it('harus mengembalikan error 400 untuk ID negatif', async () => {
      // Arrange
      const updateData = {
        name: 'Negative ID User'
      }

      // Act
      const response = await testHelper.putEndpointById(-1, updateData)

      // Assert
      expect(response.status).toBe(400)
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        expect(data).toHaveProperty('error')
      }
    })

    it('harus mengembalikan error untuk data tidak valid', async () => {
      // Arrange - Create test user
      const createdUser = await testHelper.createTestUser()

      const invalidData = {
        level: 'not a number' // Level harus number
      }

      // Act
      const response = await testHelper.putEndpointById(createdUser.id, invalidData)

      // Assert
      expect(response.status).toBe(500)
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        expect(data).toHaveProperty('error')
      }
    })

    it('harus mengembalikan error untuk request body kosong', async () => {
      // Arrange - Create test user
      const createdUser = await testHelper.createTestUser()

      // Act
      const response = await testHelper.putEndpointById(createdUser.id, {})

      // Assert
      expect(response.status).toBe(500)
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        expect(data).toHaveProperty('error')
      }
    })

    it('harus mengembalikan error untuk invalid JSON', async () => {
      // Arrange - Create test user
      const createdUser = await testHelper.createTestUser()

      // Act - Send invalid JSON
      const response = await fetch(`${BASE_URL}/users/${createdUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json'
      })

      // Assert
      expect(response.status).toBe(400)
    })

    it('harus update updatedAt timestamp', async () => {
      // Arrange - Create test user
      const createdUser = await testHelper.createTestUser({
        name: 'Timestamp User'
      })

      const originalUpdatedAt = createdUser.updatedAt

      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 100))

      const updateData = {
        name: 'Updated Timestamp User'
      }

      // Act
      const response = await testHelper.putEndpointById(createdUser.id, updateData)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('updatedAt')
      expect(new Date(data.updatedAt).getTime()).toBeGreaterThan(new Date(originalUpdatedAt).getTime())
    })

    it('harus menangani concurrent updates untuk user yang sama', async () => {
      // Arrange - Create test user
      const createdUser = await testHelper.createTestUser({
        name: 'Concurrent User',
        level: 1
      })

      // Act - Multiple concurrent updates
      const promises = [
        testHelper.putEndpointById(createdUser.id, { level: 5 }),
        testHelper.putEndpointById(createdUser.id, { level: 8 }),
        testHelper.putEndpointById(createdUser.id, { level: 10 })
      ]

      const responses = await Promise.all(promises)

      // Assert - All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })

      // Verify final state
      const getResponse = await testHelper.getEndpointById(createdUser.id)
      const getData = await getResponse.json()
      expect([5, 8, 10]).toContain(getData.level) // One of the updates should be final
    })

    it('harus mempertahankan field yang tidak di-update', async () => {
      // Arrange - Create user dengan data lengkap
      const createdUser = await testHelper.createTestUser({
        name: 'Complete User',
        email: 'complete@example.com',
        department: 'Engineering',
        region: 'Jakarta',
        level: 5
      })

      const updateData = {
        name: 'Updated Name Only'
      }

      // Act
      const response = await testHelper.putEndpointById(createdUser.id, updateData)
      const data = await response.json()

      // Assert - Only name should change
      expect(response.status).toBe(200)
      expect(data.name).toBe('Updated Name Only')
      expect(data.email).toBe('complete@example.com')
      expect(data.department).toBe('Engineering')
      expect(data.region).toBe('Jakarta')
      expect(data.level).toBe(5)
      expect(data.id).toBe(createdUser.id)
    })
  })
})