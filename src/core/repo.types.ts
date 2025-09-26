/**
 * ===================================================================
 * REPOSITORY TYPES MODULE - ROCKMAN ARCHITECTURE
 * ===================================================================
 * 
 * Domain: Type System & Generic Definitions
 * 
 * Tanggung Jawab:
 * - Definisi generic types untuk repository operations
 * - Type safety untuk CRUD operations
 * - Abstraksi type definitions yang reusable
 * - Konsistensi type system across repositories
 * 
 * Prinsip Desain:
 * - DRY: Single source untuk repository type definitions
 * - KISS: Generic types yang sederhana dan mudah dipahami
 * - SOLID:
 *   - SRP: Hanya menangani type definitions
 *   - OCP: Extensible untuk operation types baru
 *   - LSP: Generic types yang substitutable
 * 
 * Contoh Penggunaan:
 * 
 * // Define repository dengan custom types
 * interface User {
 *   id: number
 *   name: string
 *   email: string
 *   createdAt: Date
 * }
 * 
 * interface CreateUser {
 *   name: string
 *   email: string
 * }
 * 
 * interface UpdateUser {
 *   name?: string
 *   email?: string
 * }
 * 
 * // Apply generic types
 * type UserRepoTypes = RepoGenerics<
 *   User,           // TSelect - untuk read operations
 *   CreateUser,     // TCreate - untuk create operations  
 *   User,           // TReturn - untuk return values
 *   UpdateUser,     // TUpdate - untuk update operations
 *   { id: number }  // TDelete - untuk delete operations
 * >
 * 
 * // Usage dalam repository implementation
 * class UserRepository implements IRepository<UserTable> {
 *   async SELECT.All(): Promise<UserRepoTypes['TSelect'][]> { ... }
 *   async INSERT.One(data: UserRepoTypes['TCreate']): Promise<UserRepoTypes['TReturn']> { ... }
 *   async UPDATE.One(id: number, data: UserRepoTypes['TUpdate']): Promise<UserRepoTypes['TReturn']> { ... }
 * }
 * 
 * ===================================================================
 */

// core/repo/repo.types.ts

/**
 * Generic type definition untuk Repository operations
 * 
 * Menyediakan type safety dan konsistensi untuk semua CRUD operations
 * dalam repository pattern. Setiap generic parameter memiliki default
 * yang reasonable untuk kemudahan penggunaan.
 * 
 * @template TSelect - Type untuk SELECT/READ operations (data yang dibaca dari database)
 * @template TCreate - Type untuk CREATE/INSERT operations (data yang dikirim untuk create)
 * @template TReturn - Type untuk return values dari operations (biasanya sama dengan TSelect)
 * @template TUpdate - Type untuk UPDATE operations (biasanya partial dari TSelect)
 * @template TDelete - Type untuk DELETE operations (biasanya identifier saja)
 * 
 * @example
 * // Basic usage dengan defaults
 * type SimpleRepo = RepoGenerics<User>
 * // Equivalent to:
 * // TSelect: User
 * // TCreate: Partial<User>
 * // TReturn: User  
 * // TUpdate: Partial<User>
 * // TDelete: Partial<User>
 * 
 * @example
 * // Advanced usage dengan custom types
 * type ProductRepo = RepoGenerics<
 *   Product,                    // Full product data
 *   CreateProductRequest,       // Only required fields for creation
 *   ProductWithRelations,       // Product with joined data
 *   UpdateProductRequest,       // Only updatable fields
 *   { id: number }             // Only ID needed for deletion
 * >
 * 
 * @example
 * // Usage dalam repository class
 * class ProductRepository {
 *   async getAll(): Promise<ProductRepo['TSelect'][]> {
 *     return await this.table.select()
 *   }
 *   
 *   async create(data: ProductRepo['TCreate']): Promise<ProductRepo['TReturn']> {
 *     const [created] = await this.table.insert(data).returning()
 *     return created
 *   }
 * }
 */
export type RepoGenerics<
  TSelect,
  TCreate = Partial<TSelect>,
  TReturn = TSelect,
  TUpdate = Partial<TSelect>,
  TDelete = Partial<TSelect>
> = {
  /** Type untuk SELECT/READ operations - data yang dibaca dari database */
  TSelect: TSelect
  /** Type untuk CREATE/INSERT operations - data yang dikirim untuk membuat record baru */
  TCreate: TCreate
  /** Type untuk return values dari operations - biasanya data lengkap setelah operasi */
  TReturn: TReturn
  /** Type untuk UPDATE operations - data yang dikirim untuk update record */
  TUpdate: TUpdate
  /** Type untuk DELETE operations - identifier atau criteria untuk delete */
  TDelete: TDelete
}
