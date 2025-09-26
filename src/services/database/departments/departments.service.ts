import { Service } from "@/core/core.service";
import { departments } from "@/db/schema/departments";
import { DepartmentsRepository } from "@/repositories/departments/departments.repository";
import type { 
  CreateDepartmentInput, 
  UpdateDepartmentInput, 
  DepartmentQueryInput,
  BulkDepartmentInput,
  ReorderDepartmentInput
} from "@/db/schema/departments";

/**
 * Service untuk business logic departments
 * 
 * Domain: User Management - Department Management
 * Responsibility: Business logic dan validasi untuk operasi departemen
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani business logic departemen
 * - DRY: Reusable business logic
 * - KISS: Business logic yang sederhana
 * - SOLID: Dependency injection dan type safety
 */
export class DepartmentsService extends Service<typeof departments> {
  private departmentsRepository: DepartmentsRepository;

  constructor(
    departmentsRepository?: DepartmentsRepository,
    config = { enableLogging: true }
  ) {
    const repository = departmentsRepository || new DepartmentsRepository();
    super(repository, config);
    this.departmentsRepository = repository;
  }

  /**
   * Business logic untuk membuat departemen baru dengan validasi
   * @param data - Data departemen yang akan dibuat
   * @returns Promise departemen yang berhasil dibuat
   */
  async createDepartment(data: CreateDepartmentInput) {
    if (this.config.enableLogging) {
      console.log(`[DepartmentsService] Creating department: ${data.name}`)
    }

    // Validasi business rules
    await this.validateUniqueName(data.name)
    await this.validateUniqueSlug(data.slug)
    await this.validateUniqueCode(data.code)

    // Buat departemen dengan sortOrder otomatis
    const result = await this.departmentsRepository.create(data)
    
    if (this.config.enableLogging) {
      console.log(`[DepartmentsService] Department created with ID: ${result.id}`)
    }

    return result
  }

  /**
   * Business logic untuk update departemen dengan validasi
   * @param id - ID departemen yang akan diupdate
   * @param data - Data yang akan diupdate
   * @returns Promise departemen yang berhasil diupdate
   */
  async updateDepartment(id: number, data: UpdateDepartmentInput) {
    if (this.config.enableLogging) {
      console.log(`[DepartmentsService] Updating department ID: ${id}`)
    }

    // Validasi departemen exists
    const existing = await this.repository.SELECT.ById(id)
    if (!existing) {
      throw new Error(`Department with ID ${id} not found`)
    }

    // Validasi uniqueness jika ada perubahan
    if (data.name && data.name !== existing.name) {
      await this.validateUniqueName(data.name)
    }
    if (data.slug && data.slug !== existing.slug) {
      await this.validateUniqueSlug(data.slug)
    }
    if (data.code && data.code !== existing.code) {
      await this.validateUniqueCode(data.code)
    }

    const result = await this.repository.UPDATE.One(id, data)
    
    if (this.config.enableLogging) {
      console.log(`[DepartmentsService] Department updated: ${result?.name}`)
    }

    return result
  }

  /**
   * Mencari departemen berdasarkan nama
   * @param name - Nama departemen
   * @returns Promise departemen atau null
   */
  async findByName(name: string) {
    return await this.departmentsRepository.findByName(name)
  }

  /**
   * Mencari departemen berdasarkan slug
   * @param slug - Slug departemen
   * @returns Promise departemen atau null
   */
  async findBySlug(slug: string) {
    return await this.departmentsRepository.findBySlug(slug)
  }

  /**
   * Mencari departemen berdasarkan kode
   * @param code - Kode departemen
   * @returns Promise departemen atau null
   */
  async findByCode(code: string) {
    return await this.departmentsRepository.findByCode(code)
  }

  /**
   * Mendapatkan semua departemen aktif
   * @returns Promise array departemen aktif
   */
  async getActiveDepartments() {
    return await this.departmentsRepository.findActiveDepartments()
  }

  /**
   * Business logic untuk pencarian departemen dengan pagination
   * @param query - Parameter pencarian dan pagination
   * @returns Promise hasil pencarian dengan pagination
   */
  async searchDepartments(query: DepartmentQueryInput) {
    if (this.config.enableLogging) {
      console.log(`[DepartmentsService] Searching departments with query:`, query)
    }

    // Konversi query ke format yang diharapkan repository
    const filter = {
      name: query.search,
      isActive: query.isActive
    }

    const sortBy = query.sortBy || 'sortOrder'
    const sortOrder = query.sortOrder || 'asc'
    const page = query.page || 1
    const limit = query.limit || 10

    const result = await this.departmentsRepository.findWithPagination(
      filter,
      page,
      limit,
      sortBy,
      sortOrder
    )

    if (this.config.enableLogging) {
      console.log(`[DepartmentsService] Found ${result.total} departments`)
    }

    return result
  }

  /**
   * Pencarian departemen berdasarkan teks
   * @param searchTerm - Kata kunci pencarian
   * @returns Promise array departemen yang cocok
   */
  async searchByText(searchTerm: string) {
    return await this.departmentsRepository.searchByText(searchTerm)
  }

  /**
   * Business logic untuk bulk update status departemen
   * @param data - Data bulk update
   * @returns Promise boolean hasil operasi
   */
  async bulkUpdateStatus(data: BulkDepartmentInput) {
    if (this.config.enableLogging) {
      console.log(`[DepartmentsService] Bulk ${data.action} for ${data.ids.length} departments`)
    }

    const isActive = data.action === 'activate'
    const result = await this.departmentsRepository.bulkUpdateStatus(data.ids, isActive)

    if (this.config.enableLogging) {
      console.log(`[DepartmentsService] Bulk update completed: ${result}`)
    }

    return result
  }

  /**
   * Business logic untuk reorder departemen
   * @param data - Data reorder
   * @returns Promise boolean hasil operasi
   */
  async reorderDepartments(data: ReorderDepartmentInput) {
    if (this.config.enableLogging) {
      console.log(`[DepartmentsService] Reordering ${data.departments.length} departments`)
    }

    const result = await this.departmentsRepository.updateSortOrders(data.departments)

    if (this.config.enableLogging) {
      console.log(`[DepartmentsService] Reorder completed: ${result}`)
    }

    return result
  }

  /**
   * Business logic untuk soft delete departemen
   * @param id - ID departemen yang akan dihapus
   * @returns Promise boolean hasil operasi
   */
  async softDeleteDepartment(id: number) {
    if (this.config.enableLogging) {
      console.log(`[DepartmentsService] Soft deleting department ID: ${id}`)
    }

    // Validasi departemen exists
    const existing = await this.repository.SELECT.ById(id)
    if (!existing) {
      throw new Error(`Department with ID ${id} not found`)
    }

    const result = await this.repository.UPDATE.One(id, { isActive: false })

    if (this.config.enableLogging) {
      console.log(`[DepartmentsService] Department soft deleted: ${result?.name}`)
    }

    return !!result
  }

  /**
   * Mencari departemen berdasarkan ID
   * @param id - ID departemen
   * @returns Promise departemen atau null
   */
  async findById(id: number) {
    return await this.repository.SELECT.ById(id)
  }

  // Validasi helper methods
  private async validateUniqueName(name: string) {
    const existing = await this.departmentsRepository.findByName(name)
    if (existing) {
      throw new Error(`Department with name '${name}' already exists`)
    }
  }

  private async validateUniqueSlug(slug: string) {
    const existing = await this.departmentsRepository.findBySlug(slug)
    if (existing) {
      throw new Error(`Department with slug '${slug}' already exists`)
    }
  }

  private async validateUniqueCode(code: string) {
    const existing = await this.departmentsRepository.findByCode(code)
    if (existing) {
      throw new Error(`Department with code '${code}' already exists`)
    }
  }
}

/**
 * Factory function untuk membuat instance DepartmentsService
 * @returns Instance DepartmentsService yang siap digunakan
 */
export function createDepartmentsService(): DepartmentsService {
  return new DepartmentsService()
}

/**
 * Default instance untuk digunakan di aplikasi
 */
export const departmentsService = createDepartmentsService()

/**
 * Alias untuk backward compatibility
 */
export const DepartmentService = departmentsService