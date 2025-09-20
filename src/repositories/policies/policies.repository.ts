// rockman-app/src/repositories/policies/policies.repository.ts
import { Repository } from "@/core/core.repository"
import { policies } from "@/db/schema/policies"

/**
 * Policies Repository dengan Dependency Injection Pattern
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * Memungkinkan testing yang mudah dengan mock repository
 */
export class PoliciesRepository extends Repository<typeof policies> {
  /**
   * Constructor untuk inisialisasi policies repository
   * @param table - Schema tabel policies (default: policies)
   */
  constructor(table = policies) {
    super(table)
  }

  /**
   * Method khusus untuk policies - mencari berdasarkan feature ID
   * @param featureId - ID feature yang dicari
   * @returns Promise array policies untuk feature tersebut
   */
  async findByFeatureId(featureId: number) {
    const allPolicies = await this.SELECT.All()
    return allPolicies.filter(policy => policy.featureId === featureId)
  }

  /**
   * Method khusus untuk policies - mencari berdasarkan attribute
   * @param attribute - Attribute yang dicari (department, region, level)
   * @returns Promise array policies dengan attribute tersebut
   */
  async findByAttribute(attribute: string) {
    const allPolicies = await this.SELECT.All()
    return allPolicies.filter(policy => policy.attribute === attribute)
  }

  /**
   * Method khusus untuk policies - mencari berdasarkan operator
   * @param operator - Operator yang dicari (==, !=, >, >=, <, <=, in)
   * @returns Promise array policies dengan operator tersebut
   */
  async findByOperator(operator: string) {
    const allPolicies = await this.SELECT.All()
    return allPolicies.filter(policy => policy.operator === operator)
  }

  /**
   * Method khusus untuk policies - mencari berdasarkan value
   * @param value - Value yang dicari
   * @returns Promise array policies dengan value tersebut
   */
  async findByValue(value: string) {
    const allPolicies = await this.SELECT.All()
    return allPolicies.filter(policy => policy.value === value)
  }

  /**
   * Method khusus untuk policies - mencari berdasarkan feature dan attribute
   * @param featureId - ID feature
   * @param attribute - Attribute yang dicari
   * @returns Promise array policies untuk feature dan attribute tersebut
   */
  async findByFeatureAndAttribute(featureId: number, attribute: string) {
    const allPolicies = await this.SELECT.All()
    return allPolicies.filter(policy => 
      policy.featureId === featureId && policy.attribute === attribute
    )
  }

  /**
   * Method khusus untuk policies - mendapatkan semua attribute unik
   * @returns Promise array attribute unik
   */
  async getUniqueAttributes() {
    const allPolicies = await this.SELECT.All()
    const attributes = allPolicies.map(policy => policy.attribute)
    return [...new Set(attributes)]
  }

  /**
   * Method khusus untuk policies - mendapatkan semua operator unik
   * @returns Promise array operator unik
   */
  async getUniqueOperators() {
    const allPolicies = await this.SELECT.All()
    const operators = allPolicies.map(policy => policy.operator)
    return [...new Set(operators)]
  }
}

/**
 * Factory function untuk membuat instance PoliciesRepository
 * Memudahkan dependency injection dan testing
 * 
 * @returns Instance PoliciesRepository yang siap digunakan
 */
export function createPoliciesRepository(): PoliciesRepository {
  return new PoliciesRepository()
}

/**
 * Default instance PoliciesRepository untuk penggunaan langsung
 * Dapat digunakan untuk backward compatibility
 */
export const policiesRepository = createPoliciesRepository()

/**
 * Alias untuk backward compatibility dengan kode lama
 * @deprecated Gunakan policiesRepository atau createPoliciesRepository() sebagai gantinya
 */
export const PolicyRepository = policiesRepository