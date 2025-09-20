// rockman-app/src/services/policies/policies.service.ts
import { Service } from '../../../core/core.service'
import { PoliciesRepository, createPoliciesRepository } from '../../../repositories/policies/policies.repository'
import { policies } from '../../../db/schema/policies'
import { IServiceConfig } from '../../../core/core.interface'

/**
 * Policies Service dengan Dependency Injection
 * Menggunakan Repository pattern untuk akses data
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 */
export class PoliciesService extends Service<typeof policies> {
  /**
   * Constructor dengan dependency injection
   * @param repository - Instance PoliciesRepository yang di-inject
   * @param config - Konfigurasi service (optional)
   */
  constructor(
    repository: PoliciesRepository,
    config?: IServiceConfig
  ) {
    super(repository, config)
  }

  /**
   * Method khusus untuk mencari policies berdasarkan feature ID
   * @param featureId - ID feature yang dicari
   * @returns Promise array policies untuk feature tersebut
   */
  async findByFeatureId(featureId: number) {
    if (this.config.enableLogging) {
      console.log(`[PoliciesService] Finding policies by feature ID: ${featureId}`)
    }
    
    const repository = this.repository as PoliciesRepository
    return await repository.findByFeatureId(featureId)
  }

  /**
   * Method khusus untuk mencari policies berdasarkan attribute
   * @param attribute - Attribute yang dicari (department, region, level)
   * @returns Promise array policies dengan attribute tersebut
   */
  async findByAttribute(attribute: string) {
    if (this.config.enableLogging) {
      console.log(`[PoliciesService] Finding policies by attribute: ${attribute}`)
    }
    
    const repository = this.repository as PoliciesRepository
    return await repository.findByAttribute(attribute)
  }

  /**
   * Method khusus untuk mencari policies berdasarkan operator
   * @param operator - Operator yang dicari (==, !=, >, >=, <, <=, in)
   * @returns Promise array policies dengan operator tersebut
   */
  async findByOperator(operator: string) {
    if (this.config.enableLogging) {
      console.log(`[PoliciesService] Finding policies by operator: ${operator}`)
    }
    
    const repository = this.repository as PoliciesRepository
    return await repository.findByOperator(operator)
  }

  /**
   * Method khusus untuk mencari policies berdasarkan value
   * @param value - Value yang dicari
   * @returns Promise array policies dengan value tersebut
   */
  async findByValue(value: string) {
    if (this.config.enableLogging) {
      console.log(`[PoliciesService] Finding policies by value: ${value}`)
    }
    
    const repository = this.repository as PoliciesRepository
    return await repository.findByValue(value)
  }

  /**
   * Method khusus untuk mencari policies berdasarkan feature ID dan attribute
   * @param featureId - ID feature yang dicari
   * @param attribute - Attribute yang dicari
   * @returns Promise array policies dengan kombinasi feature ID dan attribute
   */
  async findByFeatureAndAttribute(featureId: number, attribute: string) {
    if (this.config.enableLogging) {
      console.log(`[PoliciesService] Finding policies by feature ID: ${featureId} and attribute: ${attribute}`)
    }
    
    const repository = this.repository as PoliciesRepository
    return await repository.findByFeatureAndAttribute(featureId, attribute)
  }

  /**
   * Method khusus untuk mendapatkan attribute unik
   * @returns Promise array attribute unik dari semua policies
   */
  async getUniqueAttributes() {
    if (this.config.enableLogging) {
      console.log(`[PoliciesService] Getting unique attributes`)
    }
    
    const repository = this.repository as PoliciesRepository
    return await repository.getUniqueAttributes()
  }

  /**
   * Method khusus untuk mendapatkan operator unik
   * @returns Promise array operator unik dari semua policies
   */
  async getUniqueOperators() {
    if (this.config.enableLogging) {
      console.log(`[PoliciesService] Getting unique operators`)
    }
    
    const repository = this.repository as PoliciesRepository
    return await repository.getUniqueOperators()
  }
}

/**
 * Factory function untuk membuat instance PoliciesService
 * Memudahkan dependency injection dan testing
 * 
 * @param config - Konfigurasi service (optional)
 * @returns Instance PoliciesService yang siap digunakan
 */
export function createPoliciesService(config?: IServiceConfig): PoliciesService {
  const repository = createPoliciesRepository()
  return new PoliciesService(repository, config)
}

/**
 * Default instance PoliciesService untuk penggunaan langsung
 * Menggunakan konfigurasi default
 */
export const policiesService = createPoliciesService()