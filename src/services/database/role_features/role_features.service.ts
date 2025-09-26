// rockman-api/src/services/role_features/role_features.service.ts
import { Service } from '../../../core/core.service'
import { RoleFeaturesRepository, createRoleFeaturesRepository } from '../../../repositories/role_features/role_features.repository'
import { roleFeatures } from '../../../db/schema/role_features'
import { IServiceConfig } from '../../../core/core.interface'

/**
 * Role Features Service dengan Dependency Injection
 * Menggunakan Repository pattern untuk akses data
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 */
export class RoleFeaturesService extends Service<typeof roleFeatures> {
  /**
   * Constructor dengan dependency injection
   * @param repository - Instance RoleFeaturesRepository yang di-inject
   * @param config - Konfigurasi service (optional)
   */
  constructor(
    repository: RoleFeaturesRepository,
    config?: IServiceConfig
  ) {
    super(repository, config)
  }

  /**
   * Method khusus untuk mencari role features berdasarkan role ID
   * @param roleId - ID role yang dicari
   * @returns Promise array role features untuk role tersebut
   */
  async findByRoleId(roleId: number) {
    if (this.config.enableLogging) {
      console.log(`[RoleFeaturesService] Finding role features by role ID: ${roleId}`)
    }
    
    const repository = this.repository as RoleFeaturesRepository
    return await repository.findByRoleId(roleId)
  }

  /**
   * Method khusus untuk mencari role features berdasarkan feature ID
   * @param featureId - ID feature yang dicari
   * @returns Promise array role features untuk feature tersebut
   */
  async findByFeatureId(featureId: number) {
    if (this.config.enableLogging) {
      console.log(`[RoleFeaturesService] Finding role features by feature ID: ${featureId}`)
    }
    
    const repository = this.repository as RoleFeaturesRepository
    return await repository.findByFeatureId(featureId)
  }

  /**
   * Method khusus untuk mencari role features berdasarkan permission create
   * @param canCreate - Status can create (true/false)
   * @returns Promise array role features dengan permission create tersebut
   */
  async findByCanCreate(canCreate: boolean) {
    if (this.config.enableLogging) {
      console.log(`[RoleFeaturesService] Finding role features by can create: ${canCreate}`)
    }
    
    const repository = this.repository as RoleFeaturesRepository
    return await repository.findByCanCreate(canCreate)
  }

  /**
   * Method khusus untuk mencari role features berdasarkan role dan feature
   * @param roleId - ID role yang dicari
   * @param featureId - ID feature yang dicari
   * @returns Promise role feature dengan kombinasi role ID dan feature ID
   */
  async findByRoleAndFeature(roleId: number, featureId: number) {
    if (this.config.enableLogging) {
      console.log(`[RoleFeaturesService] Finding role feature by role ID: ${roleId} and feature ID: ${featureId}`)
    }
    
    const repository = this.repository as RoleFeaturesRepository
    return await repository.findByRoleAndFeature(roleId, featureId)
  }

  /**
   * Method khusus untuk mencari features yang dapat dibaca oleh role
   * @param roleId - ID role yang dicari
   * @returns Promise array role features yang dapat dibaca oleh role tersebut
   */
  async findReadableFeaturesByRole(roleId: number) {
    if (this.config.enableLogging) {
      console.log(`[RoleFeaturesService] Finding readable features by role ID: ${roleId}`)
    }
    
    const repository = this.repository as RoleFeaturesRepository
    return await repository.findReadableFeaturesByRole(roleId)
  }

  /**
   * Method khusus untuk mencari roles yang memiliki akses ke feature
   * @param featureId - ID feature yang dicari
   * @returns Promise array role features untuk roles yang memiliki akses ke feature tersebut
   */
  async findRolesWithFeatureAccess(featureId: number) {
    if (this.config.enableLogging) {
      console.log(`[RoleFeaturesService] Finding roles with feature access for feature ID: ${featureId}`)
    }
    
    const repository = this.repository as RoleFeaturesRepository
    return await repository.findRolesWithFeatureAccess(featureId)
  }

  /**
   * Method khusus untuk mendapatkan feature IDs berdasarkan role
   * @param roleId - ID role yang dicari
   * @returns Promise array feature IDs untuk role tersebut
   */
  async getFeatureIdsByRole(roleId: number) {
    if (this.config.enableLogging) {
      console.log(`[RoleFeaturesService] Getting feature IDs by role ID: ${roleId}`)
    }
    
    const repository = this.repository as RoleFeaturesRepository
    return await repository.getFeatureIdsByRole(roleId)
  }

  /**
   * Method khusus untuk mendapatkan role IDs berdasarkan feature
   * @param featureId - ID feature yang dicari
   * @returns Promise array role IDs untuk feature tersebut
   */
  async getRoleIdsByFeature(featureId: number) {
    if (this.config.enableLogging) {
      console.log(`[RoleFeaturesService] Getting role IDs by feature ID: ${featureId}`)
    }
    
    const repository = this.repository as RoleFeaturesRepository
    return await repository.getRoleIdsByFeature(featureId)
  }
}

/**
 * Factory function untuk membuat instance RoleFeaturesService
 * Memudahkan dependency injection dan testing
 * 
 * @param config - Konfigurasi service (optional)
 * @returns Instance RoleFeaturesService yang siap digunakan
 */
export function createRoleFeaturesService(config?: IServiceConfig): RoleFeaturesService {
  const repository = createRoleFeaturesRepository()
  return new RoleFeaturesService(repository, config)
}

/**
 * Default instance RoleFeaturesService untuk penggunaan langsung
 * Menggunakan konfigurasi default
 */
export const roleFeaturesService = createRoleFeaturesService()