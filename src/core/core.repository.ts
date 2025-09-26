/**
 * Core Repository Module
 * 
 * Domain: Data Access Layer untuk operasi database
 * Responsibility: Menyediakan abstraksi CRUD operations dengan type safety
 * 
 * Prinsip yang diikuti:
 * - DRY: Generic repository untuk semua tabel
 * - KISS: Interface sederhana untuk operasi database
 * - SOLID: Single responsibility untuk data access
 * 
 * @example
 * // Membuat repository untuk users table
 * import { usersTable } from '../db/schema'
 * const usersRepo = new Repository(usersTable)
 * 
 * // Operasi CRUD
 * const users = await usersRepo.SELECT.All()
 * const user = await usersRepo.SELECT.ById(1)
 * const newUser = await usersRepo.INSERT.One({ name: 'John', email: 'john@example.com' })
 * const updatedUser = await usersRepo.UPDATE.One(1, { name: 'Jane' })
 * const deleted = await usersRepo.DELETE.One(1)
 * 
 * @example
 * // Dependency injection dalam service
 * class UsersService {
 *   constructor(private repo: Repository<typeof usersTable>) {}
 *   
 *   async getAllActiveUsers() {
 *     const users = await this.repo.SELECT.All()
 *     return users.filter(user => user.isActive)
 *   }
 * }
 */

import { InferInsertModel, InferSelectModel, eq } from "drizzle-orm"
import { PgTable } from "drizzle-orm/pg-core"
import db from "../db"
import { IRepository } from "./core.interface"

/**
 * Generic Repository class untuk operasi CRUD database
 * Menggunakan Drizzle ORM dengan type safety
 * Mengimplementasi IRepository interface
 * 
 * @template TTable - Tipe tabel yang extends PgTable
 * 
 * @example
 * // Inisialisasi repository
 * const productsRepo = new Repository(productsTable)
 * 
 * // Error handling otomatis
 * try {
 *   const product = await productsRepo.SELECT.ById(999)
 *   if (!product) console.log('Product not found')
 * } catch (error) {
 *   console.error('Database error:', error.message)
 * }
 */
export class Repository<TTable extends PgTable> implements IRepository<TTable> {
  /** Instance tabel Drizzle ORM */
  private table: TTable

  /**
   * Constructor untuk inisialisasi repository dengan tabel
   * @param table - Instance tabel Drizzle ORM
   * 
   * @example
   * const usersRepo = new Repository(usersTable)
   * const productsRepo = new Repository(productsTable)
   */
  constructor(table: TTable) {
    this.table = table
  }

  /**
   * Operasi SELECT untuk mengambil data dari database
   * Menyediakan method untuk query data dengan type safety
   * 
   * @example
   * // Mengambil semua data
   * const allUsers = await usersRepo.SELECT.All()
   * 
   * // Mengambil data berdasarkan ID
   * const user = await usersRepo.SELECT.ById(1)
   * if (!user) console.log('User not found')
   */
  SELECT = {
    /**
     * Mengambil semua data dari tabel
     * @returns Promise array dari semua record
     * 
     * @example
     * const products = await productsRepo.SELECT.All()
     * console.log(`Found ${products.length} products`)
     */
    All: async (): Promise<InferSelectModel<TTable>[]> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await db.select().from(this.table as any)
      return result as InferSelectModel<TTable>[]
    },
    
    /**
     * Mengambil data berdasarkan ID
     * @param id - ID record yang dicari
     * @returns Promise record atau null jika tidak ditemukan
     * 
     * @throws Error jika ID out of range atau database error
     * 
     * @example
     * const user = await usersRepo.SELECT.ById(123)
     * if (user) {
     *   console.log(`Found user: ${user.name}`)
     * } else {
     *   console.log('User not found')
     * }
     */
    ById: async (id: number): Promise<InferSelectModel<TTable> | null> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows = await db.select().from(this.table as any).where(eq((this.table as any).id, id))
        return rows.length > 0 ? (rows[0] as InferSelectModel<TTable>) : null
      } catch (error: unknown) {
        const dbError = error as { code?: string; message?: string }
        // Handle PostgreSQL specific errors
        if (dbError.code === '22003') {
          throw new Error(`ID value ${id} is out of range for PostgreSQL integer type`)
        }
        // Re-throw other database errors
        const errorMessage = dbError.message || 'Unknown database error'
        throw new Error(`Failed query: ${errorMessage}`)
      }
    }
  }

  /**
   * Operasi INSERT untuk menambah data ke database
   * Menyediakan method untuk membuat record baru dengan validation
   * 
   * @example
   * const newUser = await usersRepo.INSERT.One({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   isActive: true
   * })
   * console.log(`Created user with ID: ${newUser.id}`)
   */
  INSERT = {
    /**
     * Menambah satu record baru
     * @param values - Data yang akan diinsert
     * @returns Promise record yang baru dibuat
     * 
     * @throws Error jika insert gagal atau tidak ada data yang dikembalikan
     * 
     * @example
     * try {
     *   const product = await productsRepo.INSERT.One({
     *     name: 'New Product',
     *     price: 99.99,
     *     categoryId: 1
     *   })
     *   console.log(`Product created: ${product.name}`)
     * } catch (error) {
     *   console.error('Failed to create product:', error.message)
     * }
     */
    One: async (values: InferInsertModel<TTable>): Promise<InferSelectModel<TTable>> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows = await db.insert(this.table as any).values(values).returning() as any[]
        
        if (!rows || rows.length === 0) {
          throw new Error('Insert operation failed: No data returned')
        }
        
        return rows[0] as InferSelectModel<TTable>
      } catch (error) {
        console.error('INSERT.One error:', error)
        throw error
      }
    }
  }

  /**
   * Operasi UPDATE untuk mengubah data di database
   * Menyediakan method untuk update record dengan partial data
   * 
   * @example
   * const updatedUser = await usersRepo.UPDATE.One(1, {
   *   name: 'Jane Doe',
   *   isActive: false
   * })
   * if (updatedUser) {
   *   console.log(`Updated user: ${updatedUser.name}`)
   * } else {
   *   console.log('User not found')
   * }
   */
  UPDATE = {
    /**
     * Mengupdate satu record berdasarkan ID
     * @param id - ID record yang akan diupdate
     * @param values - Data yang akan diupdate (partial)
     * @returns Promise record yang sudah diupdate atau null jika tidak ditemukan
     * 
     * @example
     * // Update hanya field tertentu
     * const product = await productsRepo.UPDATE.One(123, {
     *   price: 149.99,
     *   updatedAt: new Date()
     * })
     * 
     * if (product) {
     *   console.log(`Product updated: ${product.name} - $${product.price}`)
     * }
     */
    One: async (id: number, values: Partial<InferInsertModel<TTable>>): Promise<InferSelectModel<TTable> | null> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows = await db.update(this.table as any).set(values).where(eq((this.table as any).id, id)).returning() as any[]
      return rows.length > 0 ? rows[0] as InferSelectModel<TTable> : null
    }
  }

  /**
   * Operasi DELETE untuk menghapus data dari database
   * Menyediakan method untuk soft/hard delete record
   * 
   * @example
   * const deleted = await usersRepo.DELETE.One(1)
   * if (deleted) {
   *   console.log('User successfully deleted')
   * } else {
   *   console.log('User not found or already deleted')
   * }
   */
  DELETE = {
    /**
     * Menghapus satu record berdasarkan ID
     * @param id - ID record yang akan dihapus
     * @returns Promise boolean status penghapusan
     * 
     * @example
     * // Hard delete record
     * try {
     *   const success = await productsRepo.DELETE.One(123)
     *   if (success) {
     *     console.log('Product permanently deleted')
     *   } else {
     *     console.log('Product not found')
     *   }
     * } catch (error) {
     *   console.error('Delete failed:', error.message)
     * }
     */
    One: async (id: number): Promise<boolean> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await db.delete(this.table as any).where(eq((this.table as any).id, id)).returning() as any[]
      return result.length > 0
    }
  }
}
