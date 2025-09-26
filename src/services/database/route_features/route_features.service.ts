// rockman-api/src/services/route_features/route_features.service.ts
import { Service } from '../../../core/core.service'
import { RouteFeaturesRepository, createRouteFeaturesRepository } from '../../../repositories/route_features/route_features.repository'
import { routeFeatures } from '../../../db/schema/route_features'
import { IServiceConfig } from '../../../core/core.interface'

/**
 * Route Features Service dengan Dependency Injection
 * Menggunakan Repository pattern untuk akses data
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 */
export class RouteFeaturesService extends Service<typeof routeFeatures> {
  /**
   * Constructor dengan dependency injection
   * @param repository - Instance RouteFeaturesRepository yang di-inject
   * @param config - Konfigurasi service (optional)
   */
  constructor(
    repository: RouteFeaturesRepository,
    config?: IServiceConfig
  ) {
    super(repository, config)
  }

  /**
   * Method khusus untuk mencari route features berdasarkan path
   * @param path - Path yang dicari
   * @returns Promise array route features untuk path tersebut
   */
  async findByPath(path: string) {
    if (this.config.enableLogging) {
      console.log(`[RouteFeaturesService] Finding route features by path: ${path}`)
    }
    
    const repository = this.repository as RouteFeaturesRepository
    return await repository.findByPath(path)
  }

  /**
   * Method khusus untuk mencari route features berdasarkan feature ID
   * @param featureId - ID feature yang dicari
   * @returns Promise array route features untuk feature tersebut
   */
  async findByFeatureId(featureId: number) {
    if (this.config.enableLogging) {
      console.log(`[RouteFeaturesService] Finding route features by feature ID: ${featureId}`)
    }
    
    const repository = this.repository as RouteFeaturesRepository
    return await repository.findByFeatureId(featureId)
  }

  /**
   * Method khusus untuk mencari route features berdasarkan path dan feature
   * @param path - Path yang dicari
   * @param featureId - ID feature yang dicari
   * @returns Promise route feature atau null jika tidak ditemukan
   */
  async findByPathAndFeature(path: string, featureId: number) {
    if (this.config.enableLogging) {
      console.log(`[RouteFeaturesService] Finding route feature by path: ${path} and feature ID: ${featureId}`)
    }
    
    const repository = this.repository as RouteFeaturesRepository
    return await repository.findByPathAndFeature(path, featureId)
  }

  /**
   * Method khusus untuk mendapatkan feature IDs berdasarkan path
   * @param path - Path yang dicari
   * @returns Promise array feature IDs untuk path tersebut
   */
  async getFeatureIdsByPath(path: string) {
    if (this.config.enableLogging) {
      console.log(`[RouteFeaturesService] Getting feature IDs by path: ${path}`)
    }
    
    const repository = this.repository as RouteFeaturesRepository
    return await repository.getFeatureIdsByPath(path)
  }

  /**
   * Method khusus untuk mendapatkan paths berdasarkan feature
   * @param featureId - ID feature yang dicari
   * @returns Promise array paths untuk feature tersebut
   */
  async getPathsByFeature(featureId: number) {
    if (this.config.enableLogging) {
      console.log(`[RouteFeaturesService] Getting paths by feature ID: ${featureId}`)
    }
    
    const repository = this.repository as RouteFeaturesRepository
    return await repository.getPathsByFeature(featureId)
  }

  /**
   * Method khusus untuk mencari route features berdasarkan pola path
   * @param pattern - Pola path yang dicari
   * @returns Promise array route features yang sesuai dengan pola path
   */
  async findByPathPattern(pattern: string) {
    if (this.config.enableLogging) {
      console.log(`[RouteFeaturesService] Finding route features by path pattern: ${pattern}`)
    }
    
    const repository = this.repository as RouteFeaturesRepository
    return await repository.findByPathPattern(pattern)
  }

  /**
   * Method khusus untuk mengecek apakah path memiliki feature
   * @param path - Path yang dicek
   * @param featureId - ID feature yang dicek
   * @returns Promise boolean apakah path memiliki feature tersebut
   */
  async hasPathFeature(path: string, featureId: number): Promise<boolean> {
    if (this.config.enableLogging) {
      console.log(`[RouteFeaturesService] Checking if path: ${path} has feature ID: ${featureId}`)
    }
    
    const repository = this.repository as RouteFeaturesRepository
    return await repository.hasPathFeature(path, featureId)
  }

  /**
   * Method khusus untuk menghitung features berdasarkan path
   * @param path - Path yang dicari
   * @returns Promise jumlah features untuk path tersebut
   */
  async countFeaturesByPath(path: string): Promise<number> {
    if (this.config.enableLogging) {
      console.log(`[RouteFeaturesService] Counting features by path: ${path}`)
    }
    
    const repository = this.repository as RouteFeaturesRepository
    return await repository.countFeaturesByPath(path)
  }

  /**
   * Method khusus untuk menghitung paths berdasarkan feature
   * @param featureId - ID feature yang dicari
   * @returns Promise jumlah paths untuk feature tersebut
   */
  async countPathsByFeature(featureId: number): Promise<number> {
    if (this.config.enableLogging) {
      console.log(`[RouteFeaturesService] Counting paths by feature ID: ${featureId}`)
    }
    
    const repository = this.repository as RouteFeaturesRepository
    return await repository.countPathsByFeature(featureId)
  }

  /**
   * Method khusus untuk mendapatkan semua paths unik
   * @returns Promise array semua paths unik
   */
  async getAllUniquePaths(): Promise<string[]> {
    if (this.config.enableLogging) {
      console.log(`[RouteFeaturesService] Getting all unique paths`)
    }
    
    const repository = this.repository as RouteFeaturesRepository
    return await repository.getAllUniquePaths()
  }
}

/**
 * Factory function untuk membuat instance RouteFeaturesService
 * Memudahkan dependency injection dan testing
 * 
 * @param config - Konfigurasi service (optional)
 * @returns Instance RouteFeaturesService yang siap digunakan
 */
export function createRouteFeaturesService(config?: IServiceConfig): RouteFeaturesService {
  const repository = createRouteFeaturesRepository()
  return new RouteFeaturesService(repository, config)
}

/**
 * Default instance RouteFeaturesService untuk penggunaan langsung
 * Menggunakan konfigurasi default
 */
export const routeFeaturesService = createRouteFeaturesService()