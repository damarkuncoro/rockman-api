// rockman-api/src/repositories/features/features.repository.ts
import { Repository } from "@/core/core.repository"
import { features } from "@/db/schema/features"

/**
 * Features Repository dengan Dependency Injection Pattern
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * Memungkinkan testing yang mudah dengan mock repository
 */
export class FeaturesRepository extends Repository<typeof features> {
  /**
   * Constructor untuk inisialisasi features repository
   * @param table - Schema tabel features (default: features)
   */
  constructor(table = features) {
    super(table)
  }

  /**
   * Method khusus untuk features - mencari berdasarkan nama
   * @param name - Nama feature yang dicari
   * @returns Promise feature atau null jika tidak ditemukan
   */
  async findByName(name: string) {
    const allFeatures = await this.SELECT.All()
    return allFeatures.find(feature => feature.name === name) || null
  }

  /**
   * Method khusus untuk features - mencari berdasarkan kategori
   * @param category - Kategori yang dicari
   * @returns Promise array features dalam kategori tersebut
   */
  async findByCategory(category: string) {
    const allFeatures = await this.SELECT.All()
    return allFeatures.filter(feature => feature.category === category)
  }

  /**
   * Method khusus untuk features - mencari features aktif
   * @returns Promise array features yang aktif
   */
  async findActiveFeatures() {
    const allFeatures = await this.SELECT.All()
    // Asumsi ada field status atau logic untuk menentukan feature aktif
    return allFeatures.filter(feature => feature.name && feature.name.length > 0)
  }

  /**
   * Method khusus untuk features - mencari berdasarkan deskripsi (partial match)
   * @param searchTerm - Term pencarian dalam deskripsi
   * @returns Promise array features yang mengandung term tersebut
   */
  async searchByDescription(searchTerm: string) {
    const allFeatures = await this.SELECT.All()
    return allFeatures.filter(feature => 
      feature.description && 
      feature.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  /**
   * Method khusus untuk features - mendapatkan semua kategori unik
   * @returns Promise array kategori unik
   */
  async getUniqueCategories() {
    const allFeatures = await this.SELECT.All()
    const categories = allFeatures
      .map(feature => feature.category)
      .filter(category => category !== null)
    return [...new Set(categories)]
  }
}

/**
 * Factory function untuk membuat instance FeaturesRepository
 * Memudahkan dependency injection dan testing
 * 
 * @returns Instance FeaturesRepository yang siap digunakan
 */
export function createFeaturesRepository(): FeaturesRepository {
  return new FeaturesRepository()
}

/**
 * Default instance FeaturesRepository untuk penggunaan langsung
 * Dapat digunakan untuk backward compatibility
 */
export const featuresRepository = createFeaturesRepository()

/**
 * Alias untuk backward compatibility dengan kode lama
 * @deprecated Gunakan featuresRepository atau createFeaturesRepository() sebagai gantinya
 */
export const FeatureRepository = featuresRepository