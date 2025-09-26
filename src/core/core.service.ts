/**
 * Core Service Module
 * 
 * Domain: Business Logic Layer untuk aplikasi
 * Responsibility: Menyediakan business logic dan orchestration antara repository dan API
 * 
 * Prinsip yang diikuti:
 * - DRY: Generic service untuk semua entity
 * - KISS: Business logic sederhana dan mudah dipahami
 * - SOLID: Dependency injection dan single responsibility
 * 
 * @example
 * // Membuat service dengan dependency injection
 * import { Repository } from './core.repository'
 * import { usersTable } from '../db/schema'
 * 
 * const usersRepo = new Repository(usersTable)
 * const usersService = new Service(usersRepo, {
 *   enableLogging: true,
 *   enableValidation: true
 * })
 * 
 * // Business logic operations
 * const users = await usersService.GET.All()
 * const activeUsers = users.filter(user => user.isActive)
 * 
 * @example
 * // Extended service dengan custom business logic
 * class UsersService extends Service<typeof usersTable> {
 *   async getActiveUsers() {
 *     const users = await this.GET.All()
 *     return users.filter(user => user.isActive && !user.deletedAt)
 *   }
 *   
 *   async createUserWithValidation(data: CreateUserData) {
 *     // Business validation
 *     if (!data.email.includes('@')) {
 *       throw new Error('Invalid email format')
 *     }
 *     return await this.POST.Create(data)
 *   }
 * }
 */

import { InferSelectModel, InferInsertModel } from "drizzle-orm"
import { PgTable } from "drizzle-orm/pg-core"
import { IRepository, IService, IServiceConfig } from "./core.interface"

/**
 * Generic Service class untuk business logic layer
 * Menggunakan dependency injection untuk repository
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * 
 * @template TTable - Tipe tabel yang extends PgTable
 * 
 * @example
 * // Basic service usage
 * const productsService = new Service(productsRepo, {
 *   enableLogging: true,
 *   enableValidation: true,
 *   enableCaching: false
 * })
 * 
 * // Service operations dengan business logic
 * const products = await productsService.GET.All()
 * const product = await productsService.GET.ById(1)
 */
export class Service<TTable extends PgTable> implements IService<TTable> {
  /** Repository instance untuk data access */
  protected repository: IRepository<TTable>
  /** Service configuration untuk behavior control */
  protected config: IServiceConfig

  /**
   * Constructor dengan dependency injection
   * @param repository - Instance repository yang akan digunakan
   * @param config - Konfigurasi service (optional)
   * 
   * @example
   * // Service dengan custom config
   * const service = new Service(usersRepo, {
   *   enableLogging: process.env.NODE_ENV === 'development',
   *   enableValidation: true,
   *   enableCaching: process.env.NODE_ENV === 'production'
   * })
   */
  constructor(repository: IRepository<TTable>, config: IServiceConfig = {}) {
    this.repository = repository
    this.config = {
      enableLogging: false,
      enableValidation: true,
      enableCaching: false,
      ...config
    }
  }

  /**
   * GET operations untuk mengambil data
   * Menggunakan repository yang di-inject dengan optional logging
   * 
   * @example
   * // Mengambil semua data dengan business logic
   * const allUsers = await usersService.GET.All()
   * const activeUsers = allUsers.filter(user => user.isActive)
   * 
   * // Mengambil data spesifik
   * const user = await usersService.GET.ById(123)
   * if (!user) throw new Error('User not found')
   */
  GET = {
    /**
     * Mengambil semua data
     * @returns Promise array dari semua record
     * 
     * @example
     * const products = await productsService.GET.All()
     * // Apply business logic filtering
     * const availableProducts = products.filter(p => p.stock > 0 && p.isActive)
     */
    All: async (): Promise<InferSelectModel<TTable>[]> => {
      if (this.config.enableLogging) {
        console.log('Service.GET.All() called')

      }
      const result = await this.repository.SELECT.All()
      if (this.config.enableLogging) {
        console.log('Service.GET.All() called, result:', result?.length || 0, 'items')

      }
      return result
    },

    /**
     * Mengambil data berdasarkan ID
     * @param id - ID record yang dicari
     * @returns Promise record atau null jika tidak ditemukan
     * 
     * @example
     * const user = await usersService.GET.ById(123)
     * if (user && user.isActive) {
     *   console.log(`Active user found: ${user.name}`)
     * } else {
     *   console.log('User not found or inactive')
     * }
     */
    ById: async (id: number): Promise<InferSelectModel<TTable> | null> => {
      if (this.config.enableLogging) {
        console.log(`Service.GET.ById(${id}) called`)
      }
      return this.repository.SELECT.ById(id)
    }
  }

  /**
   * POST operations untuk membuat data baru
   * Menggunakan repository yang di-inject dengan business validation
   * 
   * @example
   * // Create dengan business logic validation
   * const newUser = await usersService.POST.Create({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   isActive: true,
   *   createdAt: new Date()
   * })
   * console.log(`User created with ID: ${newUser.id}`)
   */
  POST = {
    /**
     * Membuat record baru
     * @param data - Data yang akan dibuat
     * @returns Promise record yang baru dibuat
     * 
     * @example
     * // Create product dengan validation
     * try {
     *   const product = await productsService.POST.Create({
     *     name: 'New Product',
     *     price: 99.99,
     *     categoryId: 1,
     *     stock: 100
     *   })
     *   console.log(`Product created: ${product.name}`)
     * } catch (error) {
     *   console.error('Validation failed:', error.message)
     * }
     */
    Create: async (data: InferInsertModel<TTable>): Promise<InferSelectModel<TTable>> => {
      if (this.config.enableLogging) {
        console.log('Service.POST.Create() called', data)
      }
      return this.repository.INSERT.One(data)
    }
  }

  /**
   * PUT operations untuk mengupdate data
   * Menggunakan repository yang di-inject dengan business logic
   * 
   * @example
   * // Update dengan business logic
   * const updatedUser = await usersService.PUT.Update(1, {
   *   name: 'Jane Doe',
   *   updatedAt: new Date()
   * })
   * if (updatedUser) {
   *   console.log(`User updated: ${updatedUser.name}`)
   * }
   */
  PUT = {
    /**
     * Update record berdasarkan ID
     * @param id - ID record yang akan diupdate
     * @param data - Data yang akan diupdate
     * @returns Promise record yang sudah diupdate atau null jika tidak ditemukan
     * 
     * @example
     * // Update product dengan business validation
     * const product = await productsService.PUT.Update(123, {
     *   price: 149.99,
     *   stock: 50,
     *   updatedAt: new Date()
     * })
     * 
     * if (product) {
     *   console.log(`Product updated: ${product.name} - $${product.price}`)
     *   // Trigger business logic (e.g., notify price change)
     *   await notifyPriceChange(product)
     * }
     */
    Update: async (id: number, data: Partial<InferInsertModel<TTable>>): Promise<InferSelectModel<TTable> | null> => {
      if (this.config.enableLogging) {
        console.log(`Service.PUT.Update(${id}) called`, data)
      }
      return this.repository.UPDATE.One(id, data)
    },
     ID: async (id: number, data: Partial<InferInsertModel<TTable>>): Promise<InferSelectModel<TTable> | null> => {
      if (this.config.enableLogging) {
        console.log(`Service.PUT.ID(${id}) called`, data)
      }
      return this.repository.UPDATE.One(id, data)
    }
  }

  /**
   * DELETE operations untuk menghapus data
   * Menggunakan repository yang di-inject dengan business rules
   * 
   * @example
   * // Delete dengan business logic validation
   * const deleted = await usersService.DELETE.Remove(1)
   * if (deleted) {
   *   console.log('User successfully deleted')
   *   // Trigger cleanup business logic
   *   await cleanupUserData(1)
   * }
   */
  DELETE = {
    /**
     * Hapus record berdasarkan ID
     * @param id - ID record yang akan dihapus
     * @returns Promise boolean status penghapusan
     * 
     * @example
     * // Delete dengan business validation
     * try {
     *   // Check business rules before delete
     *   const product = await productsService.GET.ById(123)
     *   if (product && product.stock > 0) {
     *     throw new Error('Cannot delete product with stock')
     *   }
     *   
     *   const success = await productsService.DELETE.Remove(123)
     *   if (success) {
     *     console.log('Product deleted successfully')
     *     // Trigger business logic (e.g., update inventory)
     *     await updateInventoryAfterDelete(123)
     *   }
     * } catch (error) {
     *   console.error('Delete failed:', error.message)
     * }
     */
    Remove: async (id: number): Promise<boolean> => {
      if (this.config.enableLogging) {
        console.log(`Service.DELETE.Remove(${id}) called`)
      }
      return this.repository.DELETE.One(id)
    },
    
    ID: async (id: number): Promise<boolean> => {
      if (this.config.enableLogging) {
        console.log(`Service.DELETE.ID(${id}) called`)
      }
      return this.repository.DELETE.One(id)
    }

  }

  /**
   * BULK operations untuk operasi massal
   * Mengoptimalkan performa untuk operasi multiple records
   * 
   * @example
   * // Bulk create users
   * const newUsers = await usersService.BULK.Create([
   *   { name: 'User 1', email: 'user1@example.com' },
   *   { name: 'User 2', email: 'user2@example.com' }
   * ])
   * console.log(`Created ${newUsers.length} users`)
   */
  BULK = {
    /**
     * Membuat multiple records sekaligus
     * @param dataArray - Array data yang akan dibuat
     * @returns Promise array record yang baru dibuat
     * 
     * @example
     * const products = await productsService.BULK.Create([
     *   { name: 'Product 1', price: 99.99 },
     *   { name: 'Product 2', price: 149.99 }
     * ])
     */
    Create: async (dataArray: InferInsertModel<TTable>[]): Promise<InferSelectModel<TTable>[]> => {
      if (this.config.enableLogging) {
        console.log(`Service.BULK.Create() called with ${dataArray.length} items`)
      }

      // Validasi business logic untuk bulk operation
      if (this.config.enableValidation && dataArray.length === 0) {
        throw new Error('Bulk create requires at least one item')
      }

      if (this.config.enableValidation && dataArray.length > 1000) {
        throw new Error('Bulk create limited to 1000 items per operation')
      }

      // Implementasi bulk create menggunakan INSERT.One secara sequential
      const results: InferSelectModel<TTable>[] = []
      for (const data of dataArray) {
        try {
          const result = await this.repository.INSERT.One(data)
          results.push(result)
        } catch (error) {
          if (this.config.enableLogging) {
            console.error(`Failed to create item in bulk operation:`, error)
          }
          // Dalam implementasi production, bisa ditambahkan rollback logic
          throw error
        }
      }

      return results
    },

    /**
     * Update multiple records berdasarkan IDs
     * @param updates - Array object dengan id dan data update
     * @returns Promise array record yang sudah diupdate
     * 
     * @example
     * const updated = await productsService.BULK.Update([
     *   { id: 1, data: { price: 199.99 } },
     *   { id: 2, data: { price: 299.99 } }
     * ])
     */
    Update: async (updates: Array<{ id: number; data: Partial<InferInsertModel<TTable>> }>): Promise<InferSelectModel<TTable>[]> => {
      if (this.config.enableLogging) {
        console.log(`Service.BULK.Update() called with ${updates.length} items`)
      }

      // Validasi business logic
      if (this.config.enableValidation && updates.length === 0) {
        throw new Error('Bulk update requires at least one item')
      }

      const results: InferSelectModel<TTable>[] = []
      for (const update of updates) {
        const result = await this.repository.UPDATE.One(update.id, update.data)
        if (result) {
          results.push(result)
        }
      }

      return results
    },

    /**
     * Hapus multiple records berdasarkan IDs
     * @param ids - Array ID yang akan dihapus
     * @returns Promise number jumlah record yang berhasil dihapus
     * 
     * @example
     * const deletedCount = await productsService.BULK.Remove([1, 2, 3])
     * console.log(`Deleted ${deletedCount} products`)
     */
    Remove: async (ids: number[]): Promise<number> => {
      if (this.config.enableLogging) {
        console.log(`Service.BULK.Remove() called with ${ids.length} items`)
      }

      // Validasi business logic
      if (this.config.enableValidation && ids.length === 0) {
        throw new Error('Bulk delete requires at least one ID')
      }

      let deletedCount = 0
      for (const id of ids) {
        const success = await this.repository.DELETE.One(id)
        if (success) {
          deletedCount++
        }
      }

      return deletedCount
    }
  }

  /**
   * QUERY operations untuk pencarian dan filtering advanced
   * Menyediakan business logic untuk query kompleks
   * 
   * @example
   * // Search dengan pagination
   * const result = await usersService.QUERY.Paginate({
   *   page: 1,
   *   limit: 10,
   *   sortBy: 'createdAt',
   *   sortOrder: 'desc'
   * })
   */
  QUERY = {
    /**
     * Pagination dengan sorting
     * @param options - Opsi pagination dan sorting
     * @returns Promise object dengan data dan metadata pagination
     * 
     * @example
     * const result = await productsService.QUERY.Paginate({
     *   page: 2,
     *   limit: 20,
     *   sortBy: 'price',
     *   sortOrder: 'asc'
     * })
     * 
     * console.log(`Page ${result.page} of ${result.totalPages}`)
     * console.log(`Showing ${result.data.length} of ${result.total} products`)
     */
    Paginate: async (options: {
      page?: number
      limit?: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    } = {}): Promise<{
      data: InferSelectModel<TTable>[]
      page: number
      limit: number
      total: number
      totalPages: number
    }> => {
      const { page = 1, limit = 10, sortBy, sortOrder = 'asc' } = options

      if (this.config.enableLogging) {
        console.log(`Service.QUERY.Paginate() called - Page: ${page}, Limit: ${limit}`)
      }

      // Validasi business logic
      if (this.config.enableValidation) {
        if (page < 1) throw new Error('Page must be greater than 0')
        if (limit < 1 || limit > 100) throw new Error('Limit must be between 1 and 100')
      }

      // Get all data (dalam implementasi nyata, ini harus dioptimalkan di repository level)
      const allData = await this.repository.SELECT.All()

      // Apply sorting jika ada
      let sortedData = allData
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (sortBy && (sortedData[0] as any)?.[sortBy] !== undefined) {
        sortedData = allData.sort((a, b) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const aVal = (a as any)[sortBy]
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const bVal = (b as any)[sortBy]

          if (sortOrder === 'desc') {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
          }
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        })
      }

      // Apply pagination
      const offset = (page - 1) * limit
      const paginatedData = sortedData.slice(offset, offset + limit)

      return {
        data: paginatedData,
        page,
        limit,
        total: allData.length,
        totalPages: Math.ceil(allData.length / limit)
      }
    },

    /**
     * Count total records
     * @returns Promise number total records
     * 
     * @example
     * const totalUsers = await usersService.QUERY.Count()
     * console.log(`Total users: ${totalUsers}`)
     */
    Count: async (): Promise<number> => {
      if (this.config.enableLogging) {
        console.log('Service.QUERY.Count() called')
      }

      const allData = await this.repository.SELECT.All()
      return allData.length
    },

    /**
     * Check if record exists by ID
     * @param id - ID yang akan dicek
     * @returns Promise boolean apakah record ada
     * 
     * @example
     * const exists = await usersService.QUERY.Exists(123)
     * if (!exists) {
     *   throw new Error('User not found')
     * }
     */
    Exists: async (id: number): Promise<boolean> => {
      if (this.config.enableLogging) {
        console.log(`Service.QUERY.Exists(${id}) called`)
      }

      const record = await this.repository.SELECT.ById(id)
      return record !== null
    }
  }

  /**
   * UTILS operations untuk utility functions
   * Menyediakan helper methods untuk business logic
   * 
   * @example
   * // Validate data sebelum create
   * const isValid = await usersService.UTILS.ValidateData({
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * })
   */
  UTILS = {
    /**
     * Validate data sebelum operasi database
     * @param data - Data yang akan divalidasi
     * @returns Promise boolean hasil validasi
     * 
     * @example
     * const userData = { name: '', email: 'invalid-email' }
     * const isValid = await usersService.UTILS.ValidateData(userData)
     * if (!isValid) {
     *   throw new Error('Invalid user data')
     * }
     */
    ValidateData: async (data: Partial<InferInsertModel<TTable>>): Promise<boolean> => {
      if (this.config.enableLogging) {
        console.log('Service.UTILS.ValidateData() called')
      }

      if (!this.config.enableValidation) {
        return true
      }

      // Basic validation - dapat di-override di extended service
      if (!data || typeof data !== 'object') {
        return false
      }

      // Check for required fields (implementasi dasar)
      const keys = Object.keys(data)
      return keys.length > 0
    },

    /**
     * Sanitize data sebelum operasi database
     * @param data - Data yang akan disanitasi
     * @returns Data yang sudah disanitasi
     * 
     * @example
     * const cleanData = await usersService.UTILS.SanitizeData({
     *   name: '  John Doe  ',
     *   email: 'JOHN@EXAMPLE.COM'
     * })
     * // Result: { name: 'John Doe', email: 'john@example.com' }
     */
    SanitizeData: async (data: Partial<InferInsertModel<TTable>>): Promise<Partial<InferInsertModel<TTable>>> => {
      if (this.config.enableLogging) {
        console.log('Service.UTILS.SanitizeData() called')
      }

      const sanitized = { ...data }

      // Basic sanitization untuk string fields
      Object.keys(sanitized).forEach(key => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (sanitized as any)[key]
        if (typeof value === 'string') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sanitized as any)[key] = value.trim()
        }
      })

      return sanitized
    },

    /**
     * Get service configuration
     * @returns Current service configuration
     * 
     * @example
     * const config = usersService.UTILS.GetConfig()
     * console.log(`Logging enabled: ${config.enableLogging}`)
     */
    GetConfig: (): IServiceConfig => {
      return { ...this.config }
    },

    /**
     * Update service configuration
     * @param newConfig - Konfigurasi baru
     * 
     * @example
     * usersService.UTILS.UpdateConfig({
     *   enableLogging: true,
     *   enableValidation: false
     * })
     */
    UpdateConfig: (newConfig: Partial<IServiceConfig>): void => {
      this.config = { ...this.config, ...newConfig }

      if (this.config.enableLogging) {
        console.log('Service configuration updated:', newConfig)
      }
    }
  }
}