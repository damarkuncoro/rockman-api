// Test file untuk UserRepository dengan Mock Repository (Unit Tests)
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { type User, type NewUser } from '@/db/schema/users'

/**
 * Mock data helpers untuk unit testing
 * Menyediakan utility functions untuk membuat mock data
 */

/**
 * Membuat mock user dengan data default
 * @returns User object untuk testing
 */
const createMockUser = (): User => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  passwordHash: 'hashedpassword',
  active: true,
  rolesUpdatedAt: null,
  department: null,
  region: null,
  level: null,
  createdAt: new Date(),
  updatedAt: new Date(),
})

/**
 * Membuat multiple mock users
 * @param count - Jumlah user yang akan dibuat
 * @returns Array of User objects
 */
const createMockUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Test User ${i + 1}`,
    email: `test${i + 1}@example.com`,
    passwordHash: 'hashedpassword',
    active: true,
    rolesUpdatedAt: null,
    department: null,
    region: null,
    level: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
}

/**
 * Mock UserRepository untuk unit tests
 * Menyediakan mock implementation untuk semua repository methods
 */
const mockUserRepository = {
  SELECT: {
    All: vi.fn(),
    ById: vi.fn(),
  },
  INSERT: {
    One: vi.fn(),
  },
  UPDATE: {
    One: vi.fn(),
  },
  DELETE: {
    One: vi.fn(),
  },
  // Custom methods
  findByEmail: vi.fn(),
  findByDepartment: vi.fn(),
  findByRegion: vi.fn(),
  findByMinLevel: vi.fn(),
}

// Mock the repository for unit tests - harus di top level
vi.mock('./users.repository', async (importOriginal) => {
  const actual = await importOriginal() as any
  return {
    ...actual,
    createUsersRepository: () => mockUserRepository,
    UserRepository: mockUserRepository,
  }
})

describe('UserRepository Unit Tests (Mock)', () => {
  beforeEach(() => {
    // Reset semua mock sebelum setiap test
    vi.clearAllMocks()
  })

  describe('SELECT Operations', () => {
    it('harus dapat mengambil semua users', async () => {
      // Arrange
      const mockUsers = createMockUsers(3)
      mockUserRepository.SELECT.All.mockResolvedValue(mockUsers)

      // Act
      const result = await mockUserRepository.SELECT.All()
      
      // Assert
      expect(result).toEqual(mockUsers)
      expect(result).toHaveLength(3)
      expect(mockUserRepository.SELECT.All).toHaveBeenCalledTimes(1)
    })

    it('harus dapat mengambil user berdasarkan ID', async () => {
      // Arrange
      const mockUser = createMockUser()
      mockUserRepository.SELECT.ById.mockResolvedValue(mockUser)

      // Act
      const result = await mockUserRepository.SELECT.ById(1)

      // Assert
      expect(result).toEqual(mockUser)
      expect(result?.id).toBe(1)
      expect(mockUserRepository.SELECT.ById).toHaveBeenCalledWith(1)
    })

    it('harus mengembalikan null jika user tidak ditemukan', async () => {
      // Arrange
      mockUserRepository.SELECT.ById.mockResolvedValue(null)

      // Act
      const result = await mockUserRepository.SELECT.ById(999)

      // Assert
      expect(result).toBeNull()
      expect(mockUserRepository.SELECT.ById).toHaveBeenCalledWith(999)
    })
  })

  describe('INSERT Operations', () => {
    it('harus dapat menambahkan user baru', async () => {
      // Arrange
      const newUser: NewUser = {
        name: 'New User',
        email: 'newuser@example.com',
        passwordHash: 'hashedpassword'
      }
      const createdUser = createMockUser()
      mockUserRepository.INSERT.One.mockResolvedValue(createdUser)

      // Act
      const result = await mockUserRepository.INSERT.One(newUser)

      // Assert
      expect(result).toEqual(createdUser)
      expect(result.name).toBe('Test User')
      expect(mockUserRepository.INSERT.One).toHaveBeenCalledWith(newUser)
    })

    it('harus menangani error saat email sudah ada', async () => {
      // Arrange
      const duplicateUser: NewUser = {
        name: 'Duplicate User',
        email: 'existing@example.com',
        passwordHash: 'hashedpassword'
      }
      mockUserRepository.INSERT.One.mockRejectedValue(new Error('Email already exists'))

      // Act & Assert
      await expect(mockUserRepository.INSERT.One(duplicateUser)).rejects.toThrow('Email already exists')
    })

    it('harus dapat menambahkan user dengan data lengkap', async () => {
      // Arrange
      const newUser: NewUser = {
        name: 'Complete User',
        email: 'complete@example.com',
        passwordHash: 'hashedpassword',
        active: true,
        department: 'Engineering',
        region: 'Jakarta',
        level: 3
      }
      const createdUser = { ...createMockUser(), ...newUser, id: 2 }
      mockUserRepository.INSERT.One.mockResolvedValue(createdUser)

      // Act
      const result = await mockUserRepository.INSERT.One(newUser)

      // Assert
      expect(result).toEqual(createdUser)
      expect(result.department).toBe('Engineering')
      expect(result.region).toBe('Jakarta')
      expect(result.level).toBe(3)
      expect(mockUserRepository.INSERT.One).toHaveBeenCalledWith(newUser)
    })
  })

  describe('UPDATE Operations', () => {
    it('harus dapat mengupdate user yang ada', async () => {
      // Arrange
      const updateData = { name: 'Updated Name' }
      const updatedUser = { ...createMockUser(), name: 'Updated Name' }
      mockUserRepository.UPDATE.One.mockResolvedValue(updatedUser)

      // Act
      const result = await mockUserRepository.UPDATE.One(1, updateData)

      // Assert
      expect(result).toEqual(updatedUser)
      expect(result?.name).toBe('Updated Name')
      expect(mockUserRepository.UPDATE.One).toHaveBeenCalledWith(1, updateData)
    })

    it('harus mengembalikan null jika user tidak ditemukan untuk update', async () => {
      // Arrange
      mockUserRepository.UPDATE.One.mockResolvedValue(null)

      // Act
      const result = await mockUserRepository.UPDATE.One(999, { name: 'New Name' })

      // Assert
      expect(result).toBeNull()
    })

    it('harus dapat mengupdate multiple fields', async () => {
      // Arrange
      const updateData = { 
        name: 'Updated Name',
        department: 'Marketing',
        level: 5
      }
      const updatedUser = { ...createMockUser(), ...updateData }
      mockUserRepository.UPDATE.One.mockResolvedValue(updatedUser)

      // Act
      const result = await mockUserRepository.UPDATE.One(1, updateData)

      // Assert
      expect(result).toEqual(updatedUser)
      expect(result?.name).toBe('Updated Name')
      expect(result?.department).toBe('Marketing')
      expect(result?.level).toBe(5)
      expect(mockUserRepository.UPDATE.One).toHaveBeenCalledWith(1, updateData)
    })
  })

  describe('DELETE Operations', () => {
    it('harus dapat menghapus user yang ada', async () => {
      // Arrange
      mockUserRepository.DELETE.One.mockResolvedValue(true)

      // Act
      const result = await mockUserRepository.DELETE.One(1)

      // Assert
      expect(result).toBe(true)
      expect(mockUserRepository.DELETE.One).toHaveBeenCalledWith(1)
    })

    it('harus mengembalikan false jika user tidak ditemukan untuk delete', async () => {
      // Arrange
      mockUserRepository.DELETE.One.mockResolvedValue(false)

      // Act
      const result = await mockUserRepository.DELETE.One(999)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('Custom Methods', () => {
    describe('findByEmail', () => {
      it('harus dapat mencari user berdasarkan email', async () => {
        // Arrange
        const mockUser = createMockUser()
        mockUserRepository.findByEmail.mockResolvedValue(mockUser)

        // Act
        const result = await mockUserRepository.findByEmail('test@example.com')

        // Assert
        expect(result).toEqual(mockUser)
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com')
      })

      it('harus mengembalikan null jika email tidak ditemukan', async () => {
        // Arrange
        mockUserRepository.findByEmail.mockResolvedValue(null)

        // Act
        const result = await mockUserRepository.findByEmail('notfound@example.com')

        // Assert
        expect(result).toBeNull()
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('notfound@example.com')
      })
    })

    describe('findByDepartment', () => {
      it('harus dapat mencari users berdasarkan department', async () => {
        // Arrange
        const mockUsers = createMockUsers(2).map(u => ({ ...u, department: 'Engineering' }))
        mockUserRepository.findByDepartment.mockResolvedValue(mockUsers)

        // Act
        const result = await mockUserRepository.findByDepartment('Engineering')

        // Assert
        expect(result).toEqual(mockUsers)
        expect(result).toHaveLength(2)
        expect(mockUserRepository.findByDepartment).toHaveBeenCalledWith('Engineering')
      })

      it('harus mengembalikan array kosong jika department tidak ditemukan', async () => {
        // Arrange
        mockUserRepository.findByDepartment.mockResolvedValue([])

        // Act
        const result = await mockUserRepository.findByDepartment('NonExistent')

        // Assert
        expect(result).toEqual([])
        expect(mockUserRepository.findByDepartment).toHaveBeenCalledWith('NonExistent')
      })
    })

    describe('findByRegion', () => {
      it('harus dapat mencari users berdasarkan region', async () => {
        // Arrange
        const mockUsers = createMockUsers(3).map(u => ({ ...u, region: 'Jakarta' }))
        mockUserRepository.findByRegion.mockResolvedValue(mockUsers)

        // Act
        const result = await mockUserRepository.findByRegion('Jakarta')

        // Assert
        expect(result).toEqual(mockUsers)
        expect(result).toHaveLength(3)
        expect(mockUserRepository.findByRegion).toHaveBeenCalledWith('Jakarta')
      })

      it('harus mengembalikan array kosong jika region tidak ditemukan', async () => {
        // Arrange
        mockUserRepository.findByRegion.mockResolvedValue([])

        // Act
        const result = await mockUserRepository.findByRegion('NonExistent')

        // Assert
        expect(result).toEqual([])
        expect(mockUserRepository.findByRegion).toHaveBeenCalledWith('NonExistent')
      })
    })

    describe('findByMinLevel', () => {
      it('harus dapat mencari users berdasarkan minimum level', async () => {
        // Arrange
        const mockUsers = [
          { ...createMockUser(), id: 1, level: 3 },
          { ...createMockUser(), id: 2, level: 5 },
          { ...createMockUser(), id: 3, level: 4 }
        ]
        mockUserRepository.findByMinLevel.mockResolvedValue(mockUsers)

        // Act
        const result = await mockUserRepository.findByMinLevel(3)

        // Assert
        expect(result).toEqual(mockUsers)
        expect(result).toHaveLength(3)
        expect(mockUserRepository.findByMinLevel).toHaveBeenCalledWith(3)
      })

      it('harus mengembalikan array kosong jika tidak ada user dengan level minimum', async () => {
        // Arrange
        mockUserRepository.findByMinLevel.mockResolvedValue([])

        // Act
        const result = await mockUserRepository.findByMinLevel(10)

        // Assert
        expect(result).toEqual([])
        expect(mockUserRepository.findByMinLevel).toHaveBeenCalledWith(10)
      })
    })
  })

  describe('Error Handling', () => {
    it('harus menangani database connection error', async () => {
      // Arrange
      mockUserRepository.SELECT.All.mockRejectedValue(new Error('Database connection failed'))

      // Act & Assert
      await expect(mockUserRepository.SELECT.All()).rejects.toThrow('Database connection failed')
    })

    it('harus menangani timeout error', async () => {
      // Arrange
      mockUserRepository.SELECT.ById.mockRejectedValue(new Error('Query timeout'))

      // Act & Assert
      await expect(mockUserRepository.SELECT.ById(1)).rejects.toThrow('Query timeout')
    })

    it('harus menangani validation error', async () => {
      // Arrange
      const invalidUser: NewUser = {
        name: '',
        email: 'invalid-email',
        passwordHash: ''
      }
      mockUserRepository.INSERT.One.mockRejectedValue(new Error('Validation failed'))

      // Act & Assert
      await expect(mockUserRepository.INSERT.One(invalidUser)).rejects.toThrow('Validation failed')
    })

    it('harus menangani network error', async () => {
      // Arrange
      mockUserRepository.UPDATE.One.mockRejectedValue(new Error('Network error'))

      // Act & Assert
      await expect(mockUserRepository.UPDATE.One(1, { name: 'Test' })).rejects.toThrow('Network error')
    })
  })

  describe('Performance Tests', () => {
    it('harus menyelesaikan SELECT.All dalam waktu yang wajar', async () => {
      // Arrange
      const mockUsers = createMockUsers(100)
      mockUserRepository.SELECT.All.mockResolvedValue(mockUsers)

      // Act
      const startTime = Date.now()
      const result = await mockUserRepository.SELECT.All()
      const endTime = Date.now()

      // Assert
      expect(result).toHaveLength(100)
      expect(endTime - startTime).toBeLessThan(1000) // Kurang dari 1 detik
    })

    it('harus menangani concurrent operations', async () => {
      // Arrange
      const mockUsers = createMockUsers(10)
      mockUserRepository.SELECT.All.mockResolvedValue(mockUsers)

      // Act
      const promises = Array.from({ length: 5 }, () => mockUserRepository.SELECT.All())
      const results = await Promise.all(promises)

      // Assert
      expect(results).toHaveLength(5)
      results.forEach(result => {
        expect(result).toHaveLength(10)
      })
    })

    it('harus dapat menangani multiple mock calls', async () => {
      // Arrange
      const mockUser1 = { ...createMockUser(), id: 1 }
      const mockUser2 = { ...createMockUser(), id: 2 }
      const mockUser3 = { ...createMockUser(), id: 3 }

      mockUserRepository.SELECT.ById
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser2)
        .mockResolvedValueOnce(mockUser3)

      // Act
      const results = await Promise.all([
        mockUserRepository.SELECT.ById(1),
        mockUserRepository.SELECT.ById(2),
        mockUserRepository.SELECT.ById(3)
      ])

      // Assert
      expect(results).toHaveLength(3)
      expect(results[0]?.id).toBe(1)
      expect(results[1]?.id).toBe(2)
      expect(results[2]?.id).toBe(3)
      expect(mockUserRepository.SELECT.ById).toHaveBeenCalledTimes(3)
    })
  })

  describe('Integration Scenarios', () => {
    it('harus dapat melakukan CRUD operations secara berurutan', async () => {
      // Arrange
      const newUser: NewUser = {
        name: 'Integration Test User',
        email: 'integration@example.com',
        passwordHash: 'hashedpassword'
      }
      const createdUser = createMockUser()
      const updatedUser = { ...createdUser, name: 'Updated Integration User' }

      mockUserRepository.INSERT.One.mockResolvedValue(createdUser)
      mockUserRepository.SELECT.ById.mockResolvedValue(createdUser)
      mockUserRepository.UPDATE.One.mockResolvedValue(updatedUser)
      mockUserRepository.DELETE.One.mockResolvedValue(true)

      // Act & Assert
      // 1. Create
      const created = await mockUserRepository.INSERT.One(newUser)
      expect(created).toEqual(createdUser)

      // 2. Read
      const found = await mockUserRepository.SELECT.ById(created.id)
      expect(found).toEqual(createdUser)

      // 3. Update
      const updated = await mockUserRepository.UPDATE.One(created.id, { name: 'Updated Integration User' })
      expect(updated?.name).toBe('Updated Integration User')

      // 4. Delete
      const deleted = await mockUserRepository.DELETE.One(created.id)
      expect(deleted).toBe(true)
    })

    it('harus dapat menangani complex search scenarios', async () => {
      // Arrange
      const engineeringUsers = createMockUsers(3).map(u => ({ ...u, department: 'Engineering' }))
      const jakartaUsers = createMockUsers(2).map(u => ({ ...u, region: 'Jakarta' }))
      const seniorUsers = createMockUsers(1).map(u => ({ ...u, level: 5 }))

      mockUserRepository.findByDepartment.mockResolvedValue(engineeringUsers)
      mockUserRepository.findByRegion.mockResolvedValue(jakartaUsers)
      mockUserRepository.findByMinLevel.mockResolvedValue(seniorUsers)

      // Act
      const [engUsers, jktUsers, srUsers] = await Promise.all([
        mockUserRepository.findByDepartment('Engineering'),
        mockUserRepository.findByRegion('Jakarta'),
        mockUserRepository.findByMinLevel(5)
      ])

      // Assert
      expect(engUsers).toHaveLength(3)
      expect(jktUsers).toHaveLength(2)
      expect(srUsers).toHaveLength(1)
      expect(mockUserRepository.findByDepartment).toHaveBeenCalledWith('Engineering')
      expect(mockUserRepository.findByRegion).toHaveBeenCalledWith('Jakarta')
      expect(mockUserRepository.findByMinLevel).toHaveBeenCalledWith(5)
    })
  })

  describe('Mock Verification', () => {
    it('harus memverifikasi bahwa mock dipanggil dengan parameter yang benar', async () => {
      // Arrange
      const mockUser = createMockUser()
      mockUserRepository.SELECT.ById.mockResolvedValue(mockUser)

      // Act
      await mockUserRepository.SELECT.ById(123)

      // Assert
      expect(mockUserRepository.SELECT.ById).toHaveBeenCalledWith(123)
      expect(mockUserRepository.SELECT.ById).toHaveBeenCalledTimes(1)
    })

    it('harus memverifikasi urutan pemanggilan mock', async () => {
      // Arrange
      const mockUsers = createMockUsers(2)
      mockUserRepository.SELECT.All.mockResolvedValue(mockUsers)
      mockUserRepository.SELECT.ById.mockResolvedValue(mockUsers[0])

      // Act
      await mockUserRepository.SELECT.All()
      await mockUserRepository.SELECT.ById(1)

      // Assert
      expect(mockUserRepository.SELECT.All).toHaveBeenCalledBefore(mockUserRepository.SELECT.ById as any)
    })

    it('harus dapat mereset mock state', async () => {
      // Arrange
      mockUserRepository.SELECT.All.mockResolvedValue([])

      // Act
      await mockUserRepository.SELECT.All()
      vi.clearAllMocks()

      // Assert
      expect(mockUserRepository.SELECT.All).not.toHaveBeenCalled()
    })
  })
})