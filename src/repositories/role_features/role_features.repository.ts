// rockman-api/src/repositories/role_features/role_features.repository.ts
import { Repository } from "@/core/core.repository"
import { roleFeatures } from "@/db/schema/role_features"

/**
 * Role Features Repository dengan Dependency Injection Pattern
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * Memungkinkan testing yang mudah dengan mock repository
 */
export class RoleFeaturesRepository extends Repository<typeof roleFeatures> {
  /**
   * Constructor untuk inisialisasi role features repository
   * @param table - Schema tabel role_features (default: roleFeatures)
   */
  constructor(table = roleFeatures) {
    super(table)
  }

  /**
   * Method khusus untuk role features - mencari berdasarkan role ID
   * @param roleId - ID role yang dicari
   * @returns Promise array role features untuk role tersebut
   */
  async findByRoleId(roleId: number) {
    const allRoleFeatures = await this.SELECT.All()
    return allRoleFeatures.filter(roleFeature => roleFeature.roleId === roleId)
  }

  /**
   * Method khusus untuk role features - mencari berdasarkan feature ID
   * @param featureId - ID feature yang dicari
   * @returns Promise array role features untuk feature tersebut
   */
  async findByFeatureId(featureId: number) {
    const allRoleFeatures = await this.SELECT.All()
    return allRoleFeatures.filter(roleFeature => roleFeature.featureId === featureId)
  }

  /**
   * Method khusus untuk role features - mencari berdasarkan permission create
   * @param canCreate - Status can create (true/false)
   * @returns Promise array role features dengan permission create tersebut
   */
  async findByCanCreate(canCreate: boolean) {
    const allRoleFeatures = await this.SELECT.All()
    return allRoleFeatures.filter(roleFeature => roleFeature.canCreate === canCreate)
  }

  /**
   * Method khusus untuk role features - mencari berdasarkan role dan feature
   * @param roleId - ID role
   * @param featureId - ID feature
   * @returns Promise role feature atau null jika tidak ditemukan
   */
  async findByRoleAndFeature(roleId: number, featureId: number) {
    const allRoleFeatures = await this.SELECT.All()
    return allRoleFeatures.find(roleFeature => 
      roleFeature.roleId === roleId && roleFeature.featureId === featureId
    ) || null
  }

  /**
   * Method khusus untuk role features - mencari features dengan permission read untuk role
   * @param roleId - ID role
   * @returns Promise array role features yang memiliki permission read untuk role tersebut
   */
  async findReadableFeaturesByRole(roleId: number) {
    const allRoleFeatures = await this.SELECT.All()
    return allRoleFeatures.filter(roleFeature => 
      roleFeature.roleId === roleId && roleFeature.canRead === true
    )
  }

  /**
   * Method khusus untuk role features - mencari roles yang memiliki akses read ke feature
   * @param featureId - ID feature
   * @returns Promise array role features yang memiliki akses read ke feature tersebut
   */
  async findRolesWithFeatureAccess(featureId: number) {
    const allRoleFeatures = await this.SELECT.All()
    return allRoleFeatures.filter(roleFeature => 
      roleFeature.featureId === featureId && roleFeature.canRead === true
    )
  }

  /**
   * Method khusus untuk role features - mendapatkan semua feature IDs untuk role
   * @param roleId - ID role
   * @returns Promise array feature IDs yang dimiliki role
   */
  async getFeatureIdsByRole(roleId: number) {
    const roleFeaturesList = await this.findReadableFeaturesByRole(roleId)
    return roleFeaturesList.map(roleFeature => roleFeature.featureId)
  }

  /**
   * Method khusus untuk role features - mendapatkan semua role IDs yang memiliki feature
   * @param featureId - ID feature
   * @returns Promise array role IDs yang memiliki feature
   */
  async getRoleIdsByFeature(featureId: number) {
    const roleFeaturesList = await this.findRolesWithFeatureAccess(featureId)
    return roleFeaturesList.map(roleFeature => roleFeature.roleId)
  }
}

/**
 * Factory function untuk membuat instance RoleFeaturesRepository
 * Memudahkan dependency injection dan testing
 * 
 * @returns Instance RoleFeaturesRepository yang siap digunakan
 */
export function createRoleFeaturesRepository(): RoleFeaturesRepository {
  return new RoleFeaturesRepository()
}

/**
 * Default instance RoleFeaturesRepository untuk penggunaan langsung
 * Dapat digunakan untuk backward compatibility
 */
export const roleFeaturesRepository = createRoleFeaturesRepository()

/**
 * Alias untuk backward compatibility dengan kode lama
 * @deprecated Gunakan roleFeaturesRepository atau createRoleFeaturesRepository() sebagai gantinya
 */
export const RoleFeatureRepository = roleFeaturesRepository