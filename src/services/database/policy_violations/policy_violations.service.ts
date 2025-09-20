// rockman-app/src/services/policy_violations/policy_violations.service.ts
import { Service } from '../../../core/core.service'
import { PolicyViolationsRepository, createPolicyViolationsRepository } from '../../../repositories/policy_violations/policy_violations.repository'
import { policyViolations } from '../../../db/schema/policy_violations'
import { IServiceConfig } from '../../../core/core.interface'

/**
 * Policy Violations Service dengan Dependency Injection
 * Menggunakan Repository pattern untuk akses data
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 */
export class PolicyViolationsService extends Service<typeof policyViolations> {
  /**
   * Constructor dengan dependency injection
   * @param repository - Instance PolicyViolationsRepository yang di-inject
   * @param config - Konfigurasi service (optional)
   */
  constructor(
    repository: PolicyViolationsRepository,
    config?: IServiceConfig
  ) {
    super(repository, config)
  }

  /**
   * Method khusus untuk mencari policy violations berdasarkan user ID
   * @param userId - ID user yang dicari
   * @returns Promise array policy violations untuk user tersebut
   */
  async findByUserId(userId: number) {
    if (this.config.enableLogging) {
      console.log(`[PolicyViolationsService] Finding policy violations by user ID: ${userId}`)
    }
    
    const repository = this.repository as PolicyViolationsRepository
    return await repository.findByUserId(userId)
  }

  /**
   * Method khusus untuk mencari policy violations berdasarkan feature ID
   * @param featureId - ID feature yang dicari
   * @returns Promise array policy violations untuk feature tersebut
   */
  async findByFeatureId(featureId: number) {
    if (this.config.enableLogging) {
      console.log(`[PolicyViolationsService] Finding policy violations by feature ID: ${featureId}`)
    }
    
    const repository = this.repository as PolicyViolationsRepository
    return await repository.findByFeatureId(featureId)
  }

  /**
   * Method khusus untuk mencari policy violations berdasarkan policy ID
   * @param policyId - ID policy yang dicari
   * @returns Promise array policy violations untuk policy tersebut
   */
  async findByPolicyId(policyId: number) {
    if (this.config.enableLogging) {
      console.log(`[PolicyViolationsService] Finding policy violations by policy ID: ${policyId}`)
    }
    
    const repository = this.repository as PolicyViolationsRepository
    return await repository.findByPolicyId(policyId)
  }

  /**
   * Method khusus untuk mencari policy violations berdasarkan attribute
   * @param attribute - Attribute yang dicari
   * @returns Promise array policy violations dengan attribute tersebut
   */
  async findByAttribute(attribute: string) {
    if (this.config.enableLogging) {
      console.log(`[PolicyViolationsService] Finding policy violations by attribute: ${attribute}`)
    }
    
    const repository = this.repository as PolicyViolationsRepository
    return await repository.findByAttribute(attribute)
  }

  /**
   * Method khusus untuk mencari policy violations berdasarkan expected value
   * @param expectedValue - Expected value yang dicari
   * @returns Promise array policy violations dengan expected value tersebut
   */
  async findByExpectedValue(expectedValue: string) {
    if (this.config.enableLogging) {
      console.log(`[PolicyViolationsService] Finding policy violations by expected value: ${expectedValue}`)
    }
    
    const repository = this.repository as PolicyViolationsRepository
    return await repository.findByExpectedValue(expectedValue)
  }

  /**
   * Method khusus untuk mencari policy violations berdasarkan actual value
   * @param actualValue - Actual value yang dicari
   * @returns Promise array policy violations dengan actual value tersebut
   */
  async findByActualValue(actualValue: string) {
    if (this.config.enableLogging) {
      console.log(`[PolicyViolationsService] Finding policy violations by actual value: ${actualValue}`)
    }
    
    const repository = this.repository as PolicyViolationsRepository
    return await repository.findByActualValue(actualValue)
  }

  /**
   * Method khusus untuk mencari policy violations berdasarkan rentang tanggal
   * @param startDate - Tanggal mulai
   * @param endDate - Tanggal akhir
   * @returns Promise array policy violations dalam rentang tanggal tersebut
   */
  async findByDateRange(startDate: Date, endDate: Date) {
    if (this.config.enableLogging) {
      console.log(`[PolicyViolationsService] Finding policy violations by date range: ${startDate.toISOString()} to ${endDate.toISOString()}`)
    }
    
    const repository = this.repository as PolicyViolationsRepository
    return await repository.findByDateRange(startDate, endDate)
  }

  /**
   * Method khusus untuk mencari policy violations berdasarkan user ID dan feature ID
   * @param userId - ID user yang dicari
   * @param featureId - ID feature yang dicari
   * @returns Promise array policy violations dengan kombinasi user ID dan feature ID
   */
  async findByUserAndFeature(userId: number, featureId: number) {
    if (this.config.enableLogging) {
      console.log(`[PolicyViolationsService] Finding policy violations by user ID: ${userId} and feature ID: ${featureId}`)
    }
    
    const repository = this.repository as PolicyViolationsRepository
    return await repository.findByUserAndFeature(userId, featureId)
  }
}

/**
 * Factory function untuk membuat instance PolicyViolationsService
 * Memudahkan dependency injection dan testing
 * 
 * @param config - Konfigurasi service (optional)
 * @returns Instance PolicyViolationsService yang siap digunakan
 */
export function createPolicyViolationsService(config?: IServiceConfig): PolicyViolationsService {
  const repository = createPolicyViolationsRepository()
  return new PolicyViolationsService(repository, config)
}

/**
 * Default instance PolicyViolationsService untuk penggunaan langsung
 * Menggunakan konfigurasi default
 */
export const policyViolationsService = createPolicyViolationsService()