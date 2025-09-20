// rockman-app/src/repositories/route_features/route_features.repository.ts
import { Repository } from "@/core/core.repository"
import { routeFeatures } from "@/db/schema/route_features"

/**
 * Route Features Repository dengan Dependency Injection Pattern
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * Memungkinkan testing yang mudah dengan mock repository
 */
export class RouteFeaturesRepository extends Repository<typeof routeFeatures> {
  /**
   * Constructor untuk inisialisasi route features repository
   * @param table - Schema tabel route_features (default: routeFeatures)
   */
  constructor(table = routeFeatures) {
    super(table)
  }

  /**
   * Method khusus untuk route features - mencari berdasarkan path
   * @param path - Path yang dicari
   * @returns Promise array route features untuk path tersebut
   */
  async findByPath(path: string) {
    const allRouteFeatures = await this.SELECT.All()
    return allRouteFeatures.filter(routeFeature => routeFeature.path === path)
  }

  /**
   * Method khusus untuk route features - mencari berdasarkan feature ID
   * @param featureId - ID feature yang dicari
   * @returns Promise array route features untuk feature tersebut
   */
  async findByFeatureId(featureId: number) {
    const allRouteFeatures = await this.SELECT.All()
    return allRouteFeatures.filter(routeFeature => routeFeature.featureId === featureId)
  }

  /**
   * Method khusus untuk route features - mencari berdasarkan path dan feature
   * @param path - Path yang dicari
   * @param featureId - ID feature yang dicari
   * @returns Promise route feature atau null jika tidak ditemukan
   */
  async findByPathAndFeature(path: string, featureId: number) {
    const allRouteFeatures = await this.SELECT.All()
    return allRouteFeatures.find(routeFeature => 
      routeFeature.path === path && routeFeature.featureId === featureId
    ) || null
  }

  /**
   * Method khusus untuk route features - mendapatkan semua feature IDs untuk path
   * @param path - Path yang dicari
   * @returns Promise array feature IDs yang terkait dengan path
   */
  async getFeatureIdsByPath(path: string) {
    const routeFeaturesList = await this.findByPath(path)
    return routeFeaturesList.map(routeFeature => routeFeature.featureId)
  }

  /**
   * Method khusus untuk route features - mendapatkan semua paths untuk feature
   * @param featureId - ID feature yang dicari
   * @returns Promise array paths yang terkait dengan feature
   */
  async getPathsByFeature(featureId: number) {
    const routeFeaturesList = await this.findByFeatureId(featureId)
    return routeFeaturesList.map(routeFeature => routeFeature.path)
  }

  /**
   * Method khusus untuk route features - mencari berdasarkan pattern path
   * @param pattern - Pattern path yang dicari (case insensitive)
   * @returns Promise array route features yang cocok dengan pattern
   */
  async findByPathPattern(pattern: string) {
    const allRouteFeatures = await this.SELECT.All()
    const regex = new RegExp(pattern, 'i')
    return allRouteFeatures.filter(routeFeature => regex.test(routeFeature.path))
  }

  /**
   * Method khusus untuk route features - cek apakah path memiliki feature tertentu
   * @param path - Path yang dicek
   * @param featureId - ID feature yang dicek
   * @returns Promise boolean apakah path memiliki feature tersebut
   */
  async hasPathFeature(path: string, featureId: number): Promise<boolean> {
    const routeFeature = await this.findByPathAndFeature(path, featureId)
    return routeFeature !== null
  }

  /**
   * Method khusus untuk route features - mendapatkan jumlah features per path
   * @param path - Path yang dicari
   * @returns Promise jumlah features yang terkait dengan path
   */
  async countFeaturesByPath(path: string): Promise<number> {
    const routeFeaturesList = await this.findByPath(path)
    return routeFeaturesList.length
  }

  /**
   * Method khusus untuk route features - mendapatkan jumlah paths per feature
   * @param featureId - ID feature yang dicari
   * @returns Promise jumlah paths yang terkait dengan feature
   */
  async countPathsByFeature(featureId: number): Promise<number> {
    const routeFeaturesList = await this.findByFeatureId(featureId)
    return routeFeaturesList.length
  }

  /**
   * Method khusus untuk route features - mendapatkan semua paths unik
   * @returns Promise array paths unik
   */
  async getAllUniquePaths(): Promise<string[]> {
    const allRouteFeatures = await this.SELECT.All()
    const uniquePaths = [...new Set(allRouteFeatures.map(rf => rf.path))]
    return uniquePaths
  }
}

/**
 * Factory function untuk membuat instance RouteFeaturesRepository
 * Memudahkan dependency injection dan testing
 * 
 * @returns Instance RouteFeaturesRepository yang siap digunakan
 */
export function createRouteFeaturesRepository(): RouteFeaturesRepository {
  return new RouteFeaturesRepository()
}

/**
 * Default instance RouteFeaturesRepository untuk penggunaan langsung
 * Dapat digunakan untuk backward compatibility
 */
export const routeFeaturesRepository = createRouteFeaturesRepository()

/**
 * Alias untuk backward compatibility dengan kode lama
 * @deprecated Gunakan routeFeaturesRepository atau createRouteFeaturesRepository() sebagai gantinya
 */
export const RouteFeatureRepository = routeFeaturesRepository