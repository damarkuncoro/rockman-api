// rockman-api/src/repositories/departments/departments.repository.ts
import { Repository } from "@/core/core.repository";
import { departments } from "@/db/schema/departments";
import { eq, and, desc, asc, ilike, count } from "drizzle-orm";
import db from "@/db";
import type { 
  SelectDepartment, 
  InsertDepartment, 
  UpdateDepartment,
  DepartmentFilter,
  DepartmentSortBy,
  DepartmentPagination,
  DepartmentWithUsers
} from "@/db/schema/departments";

/**
 * Departments Repository dengan Dependency Injection Pattern
 * 
 * Domain: User Management - Department Management
 * Responsibility: Mengelola operasi database untuk departemen
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi database departemen
 * - OCP: Dapat diperluas tanpa mengubah kode yang ada
 * - LSP: Dapat menggantikan Repository base class
 * - ISP: Interface yang spesifik untuk departemen
 * - DIP: Bergantung pada abstraksi Repository
 * - DRY: Reusable methods untuk berbagai operasi
 * - KISS: Implementasi yang sederhana dan jelas
 */
export class DepartmentsRepository extends Repository<typeof departments> {
  /**
   * Constructor untuk inisialisasi departments repository
   * @param table - Schema tabel departments (default: departments)
   */
  constructor(table = departments) {
    super(table);
  }

  /**
   * Mencari departemen berdasarkan nama
   * @param name - Nama departemen yang dicari
   * @returns Promise departemen atau null jika tidak ditemukan
   */
  async findByName(name: string): Promise<SelectDepartment | null> {
    const result = await db
      .select()
      .from(departments)
      .where(eq(departments.name, name))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Mencari departemen berdasarkan slug
   * @param slug - Slug departemen yang dicari
   * @returns Promise departemen atau null jika tidak ditemukan
   */
  async findBySlug(slug: string): Promise<SelectDepartment | null> {
    const result = await db
      .select()
      .from(departments)
      .where(eq(departments.slug, slug))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Mencari departemen berdasarkan kode
   * @param code - Kode departemen yang dicari
   * @returns Promise departemen atau null jika tidak ditemukan
   */
  async findByCode(code: string): Promise<SelectDepartment | null> {
    const result = await db
      .select()
      .from(departments)
      .where(eq(departments.code, code))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Mengambil semua departemen yang aktif
   * @returns Promise array departemen aktif
   */
  async findActiveDepartments(): Promise<SelectDepartment[]> {
    return await db
      .select()
      .from(departments)
      .where(eq(departments.isActive, true))
      .orderBy(asc(departments.sortOrder));
  }

  /**
   * Mengambil departemen dengan pagination dan filtering
   * @param filter - Filter untuk pencarian
   * @param page - Nomor halaman (default: 1)
   * @param limit - Jumlah item per halaman (default: 10)
   * @param sortBy - Field untuk sorting (default: 'sortOrder')
   * @param sortOrder - Arah sorting (default: 'asc')
   * @returns Promise hasil pagination
   */
  async findWithPagination(
    filter: DepartmentFilter = {},
    page: number = 1,
    limit: number = 10,
    sortBy: DepartmentSortBy = 'sortOrder',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<DepartmentPagination> {
    const conditions = [];
    
    if (filter.name) {
      conditions.push(ilike(departments.name, `%${filter.name}%`));
    }
    
    if (filter.code) {
      conditions.push(ilike(departments.code, `%${filter.code}%`));
    }
    
    if (filter.isActive !== undefined) {
      conditions.push(eq(departments.isActive, filter.isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Hitung total records
    const totalResult = await db
      .select({ count: count() })
      .from(departments)
      .where(whereClause);
    
    const total = totalResult[0].count;
    
    // Ambil data dengan pagination
    const sortColumn = departments[sortBy];
    const orderBy = sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn);
    
    const data = await db
      .select()
      .from(departments)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Mencari departemen berdasarkan teks pencarian
   * @param searchTerm - Kata kunci pencarian
   * @returns Promise array departemen yang cocok
   */
  async searchByText(searchTerm: string): Promise<SelectDepartment[]> {
    return await db
      .select()
      .from(departments)
      .where(
        and(
          eq(departments.isActive, true),
          ilike(departments.name, `%${searchTerm}%`)
        )
      )
      .orderBy(asc(departments.sortOrder));
  }

  /**
   * Mendapatkan nomor urut berikutnya untuk departemen baru
   * @returns Promise nomor urut berikutnya
   */
  async getNextSortOrder(): Promise<number> {
    const result = await db
      .select({ maxOrder: count() })
      .from(departments);
    
    return (result[0]?.maxOrder || 0) + 1;
  }

  /**
   * Update urutan sorting untuk multiple departemen
   * @param updates - Array berisi id dan sortOrder baru
   * @returns Promise boolean status berhasil
   */
  async updateSortOrders(updates: Array<{ id: number; sortOrder: number }>): Promise<boolean> {
    try {
      await db.transaction(async (tx) => {
        for (const update of updates) {
          await tx
            .update(departments)
            .set({ 
              sortOrder: update.sortOrder,
              updatedAt: new Date()
            })
            .where(eq(departments.id, update.id));
        }
      });
      return true;
    } catch (error) {
      console.error('Error updating sort orders:', error);
      return false;
    }
  }

  /**
   * Update status aktif untuk multiple departemen
   * @param ids - Array ID departemen
   * @param isActive - Status aktif baru
   * @returns Promise boolean status berhasil
   */
  async bulkUpdateStatus(ids: number[], isActive: boolean): Promise<boolean> {
    try {
      await db.transaction(async (tx) => {
        for (const id of ids) {
          await tx
            .update(departments)
            .set({ 
              isActive,
              updatedAt: new Date()
            })
            .where(eq(departments.id, id));
        }
      });
      return true;
    } catch (error) {
      console.error('Error bulk updating status:', error);
      return false;
    }
  }

  /**
   * Membuat departemen baru dengan auto-generated sortOrder
   * @param data - Data departemen baru (tanpa sortOrder)
   * @returns Promise departemen yang baru dibuat
   */
  async create(data: Omit<InsertDepartment, 'sortOrder'>): Promise<SelectDepartment> {
    const nextSortOrder = await this.getNextSortOrder();
    
    const result = await db
      .insert(departments)
      .values({
        ...data,
        sortOrder: nextSortOrder
      })
      .returning();
    
    return result[0];
  }
}

/**
 * Factory function untuk membuat instance DepartmentsRepository
 * Menggunakan Dependency Injection pattern untuk testability
 * @returns Instance DepartmentsRepository
 */
export function createDepartmentsRepository(): DepartmentsRepository {
  return new DepartmentsRepository();
}

/**
 * Singleton instance untuk digunakan di seluruh aplikasi
 * Mengikuti prinsip DRY dan konsistensi
 */
export const departmentsRepository = createDepartmentsRepository();

/**
 * Alias untuk backward compatibility dan konsistensi naming
 */
export const DepartmentRepository = departmentsRepository;