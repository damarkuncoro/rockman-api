// rockman-api/src/repositories/policy_violations/policy_violations.repository.ts
import { Repository } from "@/core/core.repository"
import { policyViolations } from "@/db/schema/policy_violations"

/**
 * Policy Violations Repository dengan Dependency Injection Pattern
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * Memungkinkan testing yang mudah dengan mock repository
 */
export class PolicyViolationsRepository extends Repository<typeof policyViolations> {
  /**
   * Constructor untuk inisialisasi policy violations repository
   * @param table - Schema tabel policy_violations (default: policyViolations)
   */
  constructor(table = policyViolations) {
    super(table)
  }

  /**
   * Method khusus untuk policy violations - mencari berdasarkan user ID
   * @param userId - ID user yang dicari
   * @returns Promise array policy violations untuk user tersebut
   */
  async findByUserId(userId: number) {
    const allViolations = await this.SELECT.All()
    return allViolations.filter(violation => violation.userId === userId)
  }

  /**
   * Method khusus untuk policy violations - mencari berdasarkan feature ID
   * @param featureId - ID feature yang dicari
   * @returns Promise array policy violations untuk feature tersebut
   */
  async findByFeatureId(featureId: number) {
    const allViolations = await this.SELECT.All()
    return allViolations.filter(violation => violation.featureId === featureId)
  }

  /**
   * Method khusus untuk policy violations - mencari berdasarkan policy ID
   * @param policyId - ID policy yang dicari
   * @returns Promise array policy violations untuk policy tersebut
   */
  async findByPolicyId(policyId: number) {
    const allViolations = await this.SELECT.All()
    return allViolations.filter(violation => violation.policyId === policyId)
  }

  /**
   * Method khusus untuk policy violations - mencari berdasarkan attribute
   * @param attribute - Attribute yang dicari
   * @returns Promise array policy violations dengan attribute tersebut
   */
  async findByAttribute(attribute: string) {
    const allViolations = await this.SELECT.All()
    return allViolations.filter(violation => violation.attribute === attribute)
  }

  /**
   * Method khusus untuk policy violations - mencari berdasarkan expected value
   * @param expectedValue - Expected value yang dicari
   * @returns Promise array policy violations dengan expected value tersebut
   */
  async findByExpectedValue(expectedValue: string) {
    const allViolations = await this.SELECT.All()
    return allViolations.filter(violation => violation.expectedValue === expectedValue)
  }

  /**
   * Method khusus untuk policy violations - mencari berdasarkan actual value
   * @param actualValue - Actual value yang dicari
   * @returns Promise array policy violations dengan actual value tersebut
   */
  async findByActualValue(actualValue: string) {
    const allViolations = await this.SELECT.All()
    return allViolations.filter(violation => violation.actualValue === actualValue)
  }

  /**
   * Method khusus untuk policy violations - mencari berdasarkan rentang tanggal
   * @param startDate - Tanggal mulai
   * @param endDate - Tanggal akhir
   * @returns Promise array policy violations dalam rentang tanggal tersebut
   */
  async findByDateRange(startDate: Date, endDate: Date) {
    const allViolations = await this.SELECT.All()
    return allViolations.filter(violation => 
      violation.createdAt >= startDate && violation.createdAt <= endDate
    )
  }

  /**
   * Method khusus untuk policy violations - mencari berdasarkan user dan feature
   * @param userId - ID user
   * @param featureId - ID feature
   * @returns Promise array policy violations untuk user dan feature tersebut
   */
  async findByUserAndFeature(userId: number, featureId: number) {
    const allViolations = await this.SELECT.All()
    return allViolations.filter(violation => 
      violation.userId === userId && violation.featureId === featureId
    )
  }
}

/**
 * Factory function untuk membuat instance PolicyViolationsRepository
 * Memudahkan dependency injection dan testing
 * 
 * @returns Instance PolicyViolationsRepository yang siap digunakan
 */
export function createPolicyViolationsRepository(): PolicyViolationsRepository {
  return new PolicyViolationsRepository()
}

/**
 * Default instance PolicyViolationsRepository untuk penggunaan langsung
 * Dapat digunakan untuk backward compatibility
 */
export const policyViolationsRepository = createPolicyViolationsRepository()

/**
 * Alias untuk backward compatibility dengan kode lama
 * @deprecated Gunakan policyViolationsRepository atau createPolicyViolationsRepository() sebagai gantinya
 */
export const PolicyViolationRepository = policyViolationsRepository