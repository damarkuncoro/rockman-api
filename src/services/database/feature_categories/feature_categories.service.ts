// rockman-api/src/services/database/feature_categories/feature_categories.service.ts
import { Service } from '../../../core/core.service'
import { FeatureCategoriesRepository, createFeatureCategoriesRepository } from '../../../repositories/feature_categories/feature_categories.repository'
import { featureCategories } from '../../../db/schema/feature_categories'
import { IServiceConfig } from '../../../core/core.interface'
import { 
  CreateFeatureCategoryInput,
  UpdateFeatureCategoryInput,
  FeatureCategoryQueryInput,
  BulkFeatureCategoryInput,
  ReorderFeatureCategoryInput
} from '../../../db/schema/feature_categories/validations/api_validation'

/**
 * Feature Categories Service dengan Dependency Injection
 * Menggunakan Repository pattern untuk akses data
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * 
 * Business logic untuk mengelola kategori fitur:
 * - Validasi business rules
 * - Orchestration operasi kompleks
 * - Caching dan optimisasi
 */
export class FeatureCategoriesService extends Service<typeof featureCategories> {
  /**
   * Constructor dengan dependency injection
   * @param repository - Instance FeatureCategoriesRepository yang di-inject
   * @param config - Konfigurasi service (optional)
   */
  constructor(
    repository: FeatureCategoriesRepository,
    config?: IServiceConfig
  ) {
    super(repository, config)
  }

  /**
   * Business logic untuk membuat kategori baru dengan validasi
   * @param data - Data kategori yang akan dibuat
   * @returns Promise kategori yang berhasil dibuat
   */
  async createCategory(data: CreateFeatureCategoryInput) {
    if (this.config.enableLogging) {
      console.log(`[FeatureCategoriesService] Creating category: ${data.name}`)
    }

    const repository = this.repository as FeatureCategoriesRepository

    // Business validation: cek duplikasi nama
    const existingByName = await repository.findByName(data.name)
    if (existingByName) {
      throw new Error(`Category dengan nama '${data.name}' sudah ada`)
    }

    // Business validation: cek duplikasi slug
    const existingBySlug = await repository.findBySlug(data.slug)
    if (existingBySlug) {
      throw new Error(`Category dengan slug '${data.slug}' sudah ada`)
    }

    return await repository.create(data)
  }

  /**
   * Business logic untuk update kategori dengan validasi
   * @param id - ID kategori yang akan diupdate
   * @param data - Data update
   * @returns Promise kategori yang berhasil diupdate
   */
  async updateCategory(id: number, data: UpdateFeatureCategoryInput) {
    if (this.config.enableLogging) {
      console.log(`[FeatureCategoriesService] Updating category ID: ${id}`)
    }

    const repository = this.repository as FeatureCategoriesRepository

    // Business validation: pastikan kategori ada
    const existing = await this.GET.ById(id)
    if (!existing) {
      throw new Error(`Category dengan ID ${id} tidak ditemukan`)
    }

    // Business validation: cek duplikasi nama (kecuali untuk kategori yang sama)
    if (data.name && data.name !== existing.name) {
      const existingByName = await repository.findByName(data.name)
      if (existingByName && existingByName.id !== id) {
        throw new Error(`Category dengan nama '${data.name}' sudah ada`)
      }
    }

    // Business validation: cek duplikasi slug (kecuali untuk kategori yang sama)
    if (data.slug && data.slug !== existing.slug) {
      const existingBySlug = await repository.findBySlug(data.slug)
      if (existingBySlug && existingBySlug.id !== id) {
        throw new Error(`Category dengan slug '${data.slug}' sudah ada`)
      }
    }

    return await this.PUT.Update(id, data)
  }

  /**
   * Business logic untuk mendapatkan kategori berdasarkan nama
   * @param name - Nama kategori yang dicari
   * @returns Promise kategori atau null jika tidak ditemukan
   */
  async findByName(name: string) {
    if (this.config.enableLogging) {
      console.log(`[FeatureCategoriesService] Finding category by name: ${name}`)
    }
    
    const repository = this.repository as FeatureCategoriesRepository
    return await repository.findByName(name)
  }

  /**
   * Business logic untuk mendapatkan kategori berdasarkan slug
   * @param slug - Slug kategori yang dicari
   * @returns Promise kategori atau null jika tidak ditemukan
   */
  async findBySlug(slug: string) {
    if (this.config.enableLogging) {
      console.log(`[FeatureCategoriesService] Finding category by slug: ${slug}`)
    }
    
    const repository = this.repository as FeatureCategoriesRepository
    return await repository.findBySlug(slug)
  }

  /**
   * Business logic untuk mendapatkan kategori aktif saja
   * @returns Promise array kategori yang aktif
   */
  async getActiveCategories() {
    if (this.config.enableLogging) {
      console.log(`[FeatureCategoriesService] Getting active categories`)
    }
    
    const repository = this.repository as FeatureCategoriesRepository
    return await repository.findActiveCategories()
  }

  /**
   * Business logic untuk pencarian kategori dengan pagination
   * @param query - Query parameters untuk pencarian
   * @returns Promise hasil pencarian dengan pagination
   */
  async searchCategories(query?: FeatureCategoryQueryInput) {
    if (this.config.enableLogging) {
      console.log(`[FeatureCategoriesService] Searching categories with query:`, query)
    }
    
    const repository = this.repository as FeatureCategoriesRepository
    
    // Parse dan validasi query parameters
    const filter = query ? {
      isActive: query.isActive,
      name: query.search,
      slug: undefined
    } : {}
    
    const page = query?.page || 1
    const limit = query?.limit || 10
    const sortBy = query?.sortBy || 'sortOrder'
    const sortOrder = query?.sortOrder || 'asc'
    
    return await repository.findWithPagination(filter, page, limit, sortBy, sortOrder)
  }

  /**
   * Business logic untuk pencarian teks pada kategori
   * @param searchTerm - Term pencarian
   * @returns Promise array kategori yang cocok
   */
  async searchByText(searchTerm: string) {
    if (this.config.enableLogging) {
      console.log(`[FeatureCategoriesService] Searching categories by text: ${searchTerm}`)
    }
    
    const repository = this.repository as FeatureCategoriesRepository
    return await repository.searchByText(searchTerm)
  }

  /**
   * Business logic untuk bulk update status kategori
   * @param data - Data bulk update
   * @returns Promise boolean success
   */
  async bulkUpdateStatus(data: BulkFeatureCategoryInput) {
    if (this.config.enableLogging) {
      console.log(`[FeatureCategoriesService] Bulk updating status for ${data.ids.length} categories`)
    }
    
    const repository = this.repository as FeatureCategoriesRepository
    
    // Business validation: pastikan semua ID ada
    for (const id of data.ids) {
      const exists = await this.QUERY.Exists(id)
      if (!exists) {
        throw new Error(`Category dengan ID ${id} tidak ditemukan`)
      }
    }

    // Tentukan status berdasarkan action
    const isActive = data.action === 'activate'
    return await repository.bulkUpdateStatus(data.ids, isActive)
  }

  /**
   * Business logic untuk reorder kategori
   * @param data - Data reorder
   * @returns Promise boolean success
   */
  async reorderCategories(data: ReorderFeatureCategoryInput) {
    if (this.config.enableLogging) {
      console.log(`[FeatureCategoriesService] Reordering ${data.categories.length} categories`)
    }
    
    const repository = this.repository as FeatureCategoriesRepository
    
    // Business validation: pastikan semua ID ada
    for (const category of data.categories) {
      const exists = await this.QUERY.Exists(category.id)
      if (!exists) {
        throw new Error(`Category dengan ID ${category.id} tidak ditemukan`)
      }
    }

    // Business validation: pastikan tidak ada duplikasi sortOrder
    const sortOrders = data.categories.map((c: { id: number; sortOrder: number }) => c.sortOrder)
    const uniqueSortOrders = new Set(sortOrders)
    if (sortOrders.length !== uniqueSortOrders.size) {
      throw new Error('Duplikasi sortOrder tidak diperbolehkan')
    }

    return await repository.updateSortOrders(data.categories)
  }

  /**
   * Business logic untuk soft delete kategori
   * Memastikan kategori tidak digunakan oleh features aktif
   * @param id - ID kategori yang akan dihapus
   * @returns Promise boolean success
   */
  async softDeleteCategory(id: number) {
    if (this.config.enableLogging) {
      console.log(`[FeatureCategoriesService] Soft deleting category ID: ${id}`)
    }

    // Business validation: pastikan kategori ada
    const category = await this.GET.ById(id)
    if (!category) {
      throw new Error(`Category dengan ID ${id} tidak ditemukan`)
    }

    // Business rule: non-aktifkan kategori daripada menghapus
    // untuk menjaga referential integrity
    return await this.PUT.Update(id, { isActive: false })
  }

  /**
   * Business logic untuk mendapatkan statistik kategori
   * @returns Promise statistik penggunaan kategori
   */
  async getCategoryStats() {
    if (this.config.enableLogging) {
      console.log(`[FeatureCategoriesService] Getting category statistics`)
    }

    const totalCategories = await this.QUERY.Count()
    const activeCategories = await this.getActiveCategories()
    
    return {
      total: totalCategories,
      active: activeCategories.length,
      inactive: totalCategories - activeCategories.length,
      activePercentage: totalCategories > 0 ? (activeCategories.length / totalCategories) * 100 : 0
    }
  }
}

/**
 * Factory function untuk membuat instance FeatureCategoriesService
 * Memudahkan dependency injection dan testing
 * 
 * @param config - Konfigurasi service (optional)
 * @returns Instance FeatureCategoriesService yang siap digunakan
 */
export function createFeatureCategoriesService(config?: IServiceConfig): FeatureCategoriesService {
  const repository = createFeatureCategoriesRepository()
  return new FeatureCategoriesService(repository, config)
}

/**
 * Default instance untuk digunakan di seluruh aplikasi
 * Menggunakan konfigurasi default
 */
export const featureCategoriesService = createFeatureCategoriesService()