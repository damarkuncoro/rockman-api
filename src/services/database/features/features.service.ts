// rockman-app/src/services/features/features.service.ts
import { Service } from '../../../core/core.service'
import { FeaturesRepository, createFeaturesRepository } from '../../../repositories/features/features.repository'
import { features } from '../../../db/schema/features'
import { IServiceConfig } from '../../../core/core.interface'

/**
 * Features Service dengan Dependency Injection
 * Menggunakan Repository pattern untuk akses data
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 */
export class FeaturesService extends Service<typeof features> {
  /**
   * Constructor dengan dependency injection
   * @param repository - Instance FeaturesRepository yang di-inject
   * @param config - Konfigurasi service (optional)
   */
  constructor(
    repository: FeaturesRepository,
    config?: IServiceConfig
  ) {
    super(repository, config)
  }

  /**
   * Method khusus untuk mencari feature berdasarkan nama
   * @param name - Nama feature yang dicari
   * @returns Promise feature atau null jika tidak ditemukan
   */
  async findByName(name: string) {
    if (this.config.enableLogging) {
      console.log(`[FeaturesService] Finding feature by name: ${name}`)
    }
    
    const repository = this.repository as FeaturesRepository
    return await repository.findByName(name)
  }

  /**
   * Method khusus untuk mencari features berdasarkan kategori
   * @param category - Kategori yang dicari
   * @returns Promise array features dalam kategori tersebut
   */
  async findByCategory(category: string) {
    if (this.config.enableLogging) {
      console.log(`[FeaturesService] Finding features by category: ${category}`)
    }
    
    const repository = this.repository as FeaturesRepository
    return await repository.findByCategory(category)
  }

  /**
   * Method khusus untuk mencari features aktif
   * @returns Promise array features yang aktif
   */
  async findActiveFeatures() {
    if (this.config.enableLogging) {
      console.log(`[FeaturesService] Finding active features`)
    }
    
    const repository = this.repository as FeaturesRepository
    return await repository.findActiveFeatures()
  }

  /**
   * Method khusus untuk mencari features berdasarkan deskripsi (partial match)
   * @param searchTerm - Term pencarian dalam deskripsi
   * @returns Promise array features yang mengandung search term
   */
  async searchByDescription(searchTerm: string) {
    if (this.config.enableLogging) {
      console.log(`[FeaturesService] Searching features by description: ${searchTerm}`)
    }
    
    const repository = this.repository as FeaturesRepository
    return await repository.searchByDescription(searchTerm)
  }

  /**
   * Method khusus untuk mendapatkan kategori unik
   * @returns Promise array kategori unik dari semua features
   */
  async getUniqueCategories() {
    if (this.config.enableLogging) {
      console.log(`[FeaturesService] Getting unique categories`)
    }
    
    const repository = this.repository as FeaturesRepository
    return await repository.getUniqueCategories()
  }
}

/**
 * Factory function untuk membuat instance FeaturesService
 * Memudahkan dependency injection dan testing
 * 
 * @param config - Konfigurasi service (optional)
 * @returns Instance FeaturesService yang siap digunakan
 */
export function createFeaturesService(config?: IServiceConfig): FeaturesService {
  const repository = createFeaturesRepository()
  return new FeaturesService(repository, config)
}

/**
 * Default instance FeaturesService untuk penggunaan langsung
 * Menggunakan konfigurasi default
 */
export const featuresService = createFeaturesService()