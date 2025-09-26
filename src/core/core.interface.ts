/**
 * Core Interface Module
 * 
 * Domain: Interface definitions untuk Repository dan Service layer
 * Responsibility: Mendefinisikan kontrak dan struktur untuk dependency injection
 * 
 * Prinsip yang diikuti:
 * - DRY: Interface yang reusable untuk semua entity
 * - KISS: Interface sederhana dan mudah dipahami
 * - SOLID: Interface segregation dan dependency inversion
 * 
 * @example
 * // Implementasi Repository
 * class UsersRepository implements IRepository<typeof usersTable> {
 *   async SELECT.All() { return await db.select().from(usersTable) }
 *   async SELECT.ById(id) { return await db.select().from(usersTable).where(eq(usersTable.id, id)) }
 * }
 * 
 * @example
 * // Implementasi Service dengan dependency injection
 * class UsersService implements IService<typeof usersTable> {
 *   constructor(private repo: IRepository<typeof usersTable>) {}
 *   
 *   async GET.All() { return await this.repo.SELECT.All() }
 *   async POST.Create(data) { return await this.repo.INSERT.One(data) }
 * }
 */

import { InferSelectModel, InferInsertModel } from "drizzle-orm"
import { PgTable } from "drizzle-orm/pg-core"

/**
 * Interface untuk Repository operations
 * Memungkinkan dependency injection dan testing yang lebih mudah
 * 
 * @template TTable - Tipe tabel yang extends PgTable
 * 
 * @example
 * // Implementasi untuk users table
 * const usersRepo: IRepository<typeof usersTable> = {
 *   SELECT: {
 *     All: () => db.select().from(usersTable),
 *     ById: (id) => db.select().from(usersTable).where(eq(usersTable.id, id))
 *   },
 *   INSERT: {
 *     One: (data) => db.insert(usersTable).values(data).returning()
 *   }
 * }
 */
export interface IRepository<TTable extends PgTable> {
  /** Operasi SELECT untuk mengambil data */
  SELECT: {
    /** 
     * Mengambil semua record dari tabel
     * @returns Promise array dari semua record
     * 
     * @example
     * const users = await repo.SELECT.All()
     * console.log(`[REPOSITORY] Fetched ${users.length} users`)
     */
    All(): Promise<InferSelectModel<TTable>[]>
    
    /** 
     * Mengambil record berdasarkan ID
     * @param id - ID record yang dicari
     * @returns Promise record atau null jika tidak ditemukan
     * 
     * @example
     * const user = await repo.SELECT.ById(123)
     * console.log(`[REPOSITORY] User ${id}: ${user ? 'found' : 'not found'}`)
     */
    ById(id: number): Promise<InferSelectModel<TTable> | null>
  }
  /** Operasi INSERT untuk menambah data */
  INSERT: {
    /** 
     * Menambah satu record baru
     * @param data - Data record yang akan ditambahkan
     * @returns Promise record yang baru dibuat
     * 
     * @example
     * const newUser = await repo.INSERT.One({ name: 'John', email: 'john@example.com' })
     * console.log(`[REPOSITORY] Created user with ID: ${newUser.id}`)
     */
    One(data: InferInsertModel<TTable>): Promise<InferSelectModel<TTable>>
  }
  /** Operasi UPDATE untuk mengubah data */
  UPDATE: {
    /** 
     * Mengubah satu record berdasarkan ID
     * @param id - ID record yang akan diubah
     * @param data - Data yang akan diupdate (partial)
     * @returns Promise record yang telah diupdate atau null jika tidak ditemukan
     * 
     * @example
     * const updatedUser = await repo.UPDATE.One(123, { name: 'Jane Doe' })
     * console.log(`[REPOSITORY] Updated user ${id}: ${updatedUser ? 'success' : 'not found'}`)
     */
    One(id: number, data: Partial<InferInsertModel<TTable>>): Promise<InferSelectModel<TTable> | null>
  }
  /** Operasi DELETE untuk menghapus data */
  DELETE: {
    /** 
     * Menghapus satu record berdasarkan ID
     * @param id - ID record yang akan dihapus
     * @returns Promise boolean (true jika berhasil dihapus)
     * 
     * @example
     * const deleted = await repo.DELETE.One(123)
     * console.log(`[REPOSITORY] Deleted user ${id}: ${deleted ? 'success' : 'failed'}`)
     */
    One(id: number): Promise<boolean>
  }
}

/**
 * Interface untuk Service operations
 * Mendefinisikan kontrak untuk service layer
 * 
 * @template TTable - Tipe tabel yang extends PgTable
 * 
 * @example
 * // Implementasi service dengan business logic
 * class ProductsService implements IService<typeof productsTable> {
 *   constructor(private repo: IRepository<typeof productsTable>) {}
 *   
 *   async GET.All() {
 *     const products = await this.repo.SELECT.All()
 *     return products.filter(p => p.isActive) // Business logic
 *   }
 *   
 *   async POST.Create(data) {
 *     // Validation business logic
 *     if (!data.name) throw new Error('Name is required')
 *     return await this.repo.INSERT.One(data)
 *   }
 * }
 */
export interface IService<TTable extends PgTable> {
  /** Operasi GET untuk mengambil data dengan business logic */
  GET: {
    /** 
     * Mengambil semua record dengan filtering business logic
     * @returns Promise array dari record yang telah difilter
     * 
     * @example
     * const users = await service.GET.All()
     * console.log(`[SERVICE] Retrieved ${users.length} users after business logic filtering`)
     */
    All(): Promise<InferSelectModel<TTable>[]>
    
    /** 
     * Mengambil record berdasarkan ID dengan validation
     * @param id - ID record yang dicari
     * @returns Promise record atau null jika tidak ditemukan/tidak valid
     * 
     * @example
     * const user = await service.GET.ById(123)
     * console.log(`[SERVICE] User ${id}: ${user ? 'found and validated' : 'not found or invalid'}`)
     */
    ById(id: number): Promise<InferSelectModel<TTable> | null>
  }
  /** Operasi POST untuk membuat data dengan validation */
  POST: {
    /** 
     * Membuat record baru dengan business rules
     * @param data - Data record yang akan dibuat
     * @returns Promise record yang baru dibuat setelah validation
     * 
     * @example
     * const newUser = await service.POST.Create({ name: 'John', email: 'john@example.com' })
     * console.log(`[SERVICE] Created user with ID: ${newUser.id} after validation`)
     */
    Create(data: InferInsertModel<TTable>): Promise<InferSelectModel<TTable>>
  }
  /** Operasi PUT untuk mengubah data dengan validation */
  PUT: {
    /** 
     * Mengubah record dengan business rules dan validation
     * @param id - ID record yang akan diubah
     * @param data - Data yang akan diupdate (partial)
     * @returns Promise record yang telah diupdate atau null jika tidak valid
     * 
     * @example
     * const updatedUser = await service.PUT.Update(123, { name: 'Jane Doe' })
     * console.log(`[SERVICE] Updated user ${id}: ${updatedUser ? 'success after validation' : 'failed validation'}`)
     */
    Update(id: number, data: Partial<InferInsertModel<TTable>>): Promise<InferSelectModel<TTable> | null>
  }
  /** Operasi DELETE untuk menghapus data dengan business rules */
  DELETE: {
    /** 
     * Menghapus record dengan business validation
     * @param id - ID record yang akan dihapus
     * @returns Promise boolean (true jika berhasil dihapus setelah validation)
     * 
     * @example
     * const deleted = await service.DELETE.Remove(123)
     * console.log(`[SERVICE] Deleted user ${id}: ${deleted ? 'success after business rules check' : 'failed validation'}`)
     */
    Remove(id: number): Promise<boolean>
  }
}

/**
 * Base interface untuk service configuration
 * Memungkinkan konfigurasi tambahan untuk service
 * 
 * @example
 * // Konfigurasi service dengan logging dan caching
 * const serviceConfig: IServiceConfig = {
 *   enableLogging: true,
 *   enableValidation: true,
 *   enableCaching: false
 * }
 * 
 * // Penggunaan dalam service constructor
 * class UsersService {
 *   constructor(
 *     private repo: IRepository<typeof usersTable>,
 *     private config: IServiceConfig = {}
 *   ) {}
 * }
 */
export interface IServiceConfig {
  /** 
   * Mengaktifkan logging untuk operasi service
   * Ketika true, service akan mencatat semua operasi CRUD
   * 
   * @default false
   * @example
   * // Dengan logging enabled
   * const config: IServiceConfig = { enableLogging: true }
   * // Output: [SERVICE] Retrieved 10 users after business logic filtering
   * // Output: [SERVICE] Created user with ID: 123 after validation
   */
  enableLogging?: boolean
  
  /** 
   * Mengaktifkan validasi data untuk operasi service
   * Ketika true, service akan memvalidasi input sebelum operasi
   * 
   * @default true
   * @example
   * // Dengan validation enabled
   * const config: IServiceConfig = { enableValidation: true }
   * // Akan throw error jika data tidak valid
   */
  enableValidation?: boolean
  
  /** 
   * Mengaktifkan caching untuk operasi read service
   * Ketika true, service akan cache hasil query untuk performa
   * 
   * @default false
   * @example
   * // Dengan caching enabled
   * const config: IServiceConfig = { enableCaching: true }
   * // Hasil GET.All() akan di-cache untuk request berikutnya
   */
  enableCaching?: boolean
}