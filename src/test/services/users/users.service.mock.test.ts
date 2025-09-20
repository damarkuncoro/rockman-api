// rockman-app/src/test/services/users/users.service.mock.test.ts
/**
 * Unit Tests untuk Users Service dengan Mock Repository
 * Fokus pada testing business logic tanpa dependency database
 * Menggunakan Vitest mocking untuk isolasi testing
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Service } from '@/core/core.service'
import { users, type User, type NewUser } from '@/db/schema/users'
import { IRepository } from '@/core/core.interface'

/**
 * Mock Repository untuk Unit Testing
 * Menggunakan Vitest mocks untuk isolasi testing
 * Memungkinkan testing business logic tanpa database dependency
 */
const mockRepository: IRepository<typeof users> = {
  SELECT: {
    All: vi.fn(),
    ById: vi.fn()
  },
  INSERT: {
    One: vi.fn()
  },
  UPDATE: {
    One: vi.fn()
  },
  DELETE: {
    One: vi.fn()
  }
}

/**
 * Helper function untuk membuat mock user data
 * Menyediakan data test yang konsisten dengan default values
 * 
 * @param overrides - Properties yang ingin di-override
 * @returns Mock user object dengan data test
 */
function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    passwordHash: 'hashed_password',
    active: true,
    rolesUpdatedAt: null,
    department: 'Engineering',
    region: 'Jakarta',
    level: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }
}

/**
 * Helper function untuk membuat array mock users
 * Berguna untuk testing operasi yang mengembalikan multiple records
 * 
 * @param count - Jumlah users yang akan dibuat
 * @returns Array of mock user objects
 */
function createMockUsers(count: number): User[] {
  return Array.from({ length: count }, (_, index) => 
    createMockUser({ 
      id: index + 1, 
      email: `user${index + 1}@example.com`,
      name: `User ${index + 1}`
    })
  )
}

/**
 * Unit Tests untuk Users Service dengan Mock Repository
 * Fokus pada testing business logic dan service layer behavior
 * Menggunakan dependency injection pattern untuk testability
 */
describe('Users Service - Unit Tests (Mock Repository)', () => {
  let usersService: Service<typeof users>

  /**
   * Setup untuk setiap test case
   * Reset mocks dan create fresh service instance
   */
  beforeEach(() => {
    // Reset all mocks untuk memastikan test isolation
    vi.clearAllMocks()
    
    // Create service instance dengan mock repository
    usersService = new Service(mockRepository, {
      enableLogging: false,
      enableValidation: true
    })
  })

  describe('GET Operations', () => {
    it('harus mengambil semua users melalui repository', async () => {
      // Arrange
      const mockUsers = createMockUsers(3)
      mockRepository.SELECT.All = vi.fn().mockResolvedValue(mockUsers)
      console.log('Mock users:', mockUsers)

      // Act
      const result = await usersService.GET.All()

      // Assert
      expect(mockRepository.SELECT.All).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockUsers)
      expect(result).toHaveLength(3)
    })

    it('harus mengambil user berdasarkan ID melalui repository', async () => {
      // Arrange
      const mockUser = createMockUser({ id: 1 })
      mockRepository.SELECT.ById = vi.fn().mockResolvedValue(mockUser)

      // Act
      const result = await usersService.GET.ById(1)

      // Assert
      expect(mockRepository.SELECT.ById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockUser)
    })

    it('harus mengembalikan null jika user tidak ditemukan', async () => {
      // Arrange
      mockRepository.SELECT.ById = vi.fn().mockResolvedValue(null)

      // Act
      const result = await usersService.GET.ById(999)

      // Assert
      expect(mockRepository.SELECT.ById).toHaveBeenCalledWith(999)
      expect(result).toBeNull()
    })
  })

  describe('POST Operations', () => {
    it('harus membuat user baru melalui repository', async () => {
      // Arrange
      const newUserData: NewUser = {
        name: 'New User',
        email: 'new@example.com',
        passwordHash: 'hashed_password',
        department: 'Marketing',
        region: 'Surabaya',
        level: 3
      }
      const createdUser = createMockUser({ ...newUserData, id: 4 })
      mockRepository.INSERT.One = vi.fn().mockResolvedValue(createdUser)

      // Act
      const result = await usersService.POST.Create(newUserData)

      // Assert
      expect(mockRepository.INSERT.One).toHaveBeenCalledWith(newUserData)
      expect(result).toEqual(createdUser)
    })
  })

  describe('PUT Operations', () => {
    it('harus mengupdate user melalui repository', async () => {
      // Arrange
      const updateData = { name: 'Updated Name', level: 6 }
      const updatedUser = createMockUser({ id: 1, ...updateData })
      mockRepository.UPDATE.One = vi.fn().mockResolvedValue(updatedUser)

      // Act
      const result = await usersService.PUT.Update(1, updateData)

      // Assert
      expect(mockRepository.UPDATE.One).toHaveBeenCalledWith(1, updateData)
      expect(result).toEqual(updatedUser)
    })
  })

  describe('DELETE Operations', () => {
    it('harus menghapus user melalui repository', async () => {
      // Arrange
      mockRepository.DELETE.One = vi.fn().mockResolvedValue(true)

      // Act
      const result = await usersService.DELETE.Remove(1)

      // Assert
      expect(mockRepository.DELETE.One).toHaveBeenCalledWith(1)
      expect(result).toBe(true)
    })

    it('harus mengembalikan false jika penghapusan gagal', async () => {
      // Arrange
      mockRepository.DELETE.One = vi.fn().mockResolvedValue(false)

      // Act
      const result = await usersService.DELETE.Remove(999)

      // Assert
      expect(mockRepository.DELETE.One).toHaveBeenCalledWith(999)
      expect(result).toBe(false)
    })
  })

  describe('Service Configuration', () => {
    it('harus menggunakan konfigurasi yang diberikan', () => {
      // Arrange & Act
      const serviceWithLogging = new Service(mockRepository, {
        enableLogging: true,
        enableValidation: false,
        enableCaching: true
      })

      // Assert
      expect(serviceWithLogging).toBeDefined()
      // Note: Konfigurasi internal tidak bisa ditest langsung karena private
      // Tapi bisa ditest melalui behavior (logging, validation, dll)
    })
  })

  describe('Error Handling', () => {
    it('harus meneruskan error dari repository', async () => {
      // Arrange
      const error = new Error('Database connection failed')
      mockRepository.SELECT.All = vi.fn().mockRejectedValue(error)

      // Act & Assert
      await expect(usersService.GET.All()).rejects.toThrow('Database connection failed')
    })
  })
})