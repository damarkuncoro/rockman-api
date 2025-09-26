// rockman-api/src/repositories/feature_categories/feature_categories.repository.ts
import { Repository } from "@/core/core.repository";
import { featureCategories } from "@/db/schema/feature_categories";
import { eq, and, desc, asc, ilike, count } from "drizzle-orm";
import db from "@/db";
import type { 
  SelectFeatureCategory, 
  InsertFeatureCategory, 
  UpdateFeatureCategory,
  FeatureCategoryFilter,
  FeatureCategorySortBy,
  FeatureCategoryPagination
} from "@/db/schema/feature_categories";

/**
 * Feature Categories Repository dengan Dependency Injection Pattern
 * 
 * Domain: RBAC - Feature Management
 * Responsibility: Mengelola operasi database untuk kategori fitur
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi database kategori fitur
 * - OCP: Dapat diperluas tanpa mengubah kode yang ada
 * - LSP: Dapat menggantikan Repository base class
 * - ISP: Interface yang spesifik untuk kategori fitur
 * - DIP: Bergantung pada abstraksi Repository
 * - DRY: Reusable methods untuk berbagai operasi
 * - KISS: Implementasi yang sederhana dan jelas
 */
export class FeatureCategoriesRepository extends Repository<typeof featureCategories> {
  /**
   * Constructor untuk inisialisasi feature categories repository
   * @param table - Schema tabel feature_categories (default: featureCategories)
   */
  constructor(table = featureCategories) {
    super(table);
  }

  /**
   * Mencari kategori berdasarkan nama
   * @param name - Nama kategori yang dicari
   * @returns Promise kategori atau null jika tidak ditemukan
   */
  async findByName(name: string): Promise<SelectFeatureCategory | null> {
    const result = await db
      .select()
      .from(featureCategories)
      .where(eq(featureCategories.name, name))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Mencari kategori berdasarkan slug
   * @param slug - Slug kategori yang dicari
   * @returns Promise kategori atau null jika tidak ditemukan
   */
  async findBySlug(slug: string): Promise<SelectFeatureCategory | null> {
    const result = await db
      .select()
      .from(featureCategories)
      .where(eq(featureCategories.slug, slug))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Mencari kategori aktif saja
   * @returns Promise array kategori yang aktif
   */
  async findActiveCategories(): Promise<SelectFeatureCategory[]> {
    return await db
      .select()
      .from(featureCategories)
      .where(eq(featureCategories.isActive, true))
      .orderBy(asc(featureCategories.sortOrder), asc(featureCategories.name));
  }

  /**
   * Mencari kategori dengan filter dan pagination
   * @param filter - Filter untuk pencarian
   * @param page - Halaman (default: 1)
   * @param limit - Jumlah per halaman (default: 10)
   * @param sortBy - Field untuk sorting (default: 'sortOrder')
   * @param sortOrder - Arah sorting (default: 'asc')
   * @returns Promise pagination result
   */
  async findWithPagination(
    filter: FeatureCategoryFilter = {},
    page: number = 1,
    limit: number = 10,
    sortBy: FeatureCategorySortBy = 'sortOrder',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<FeatureCategoryPagination> {
    const offset = (page - 1) * limit;
    const conditions = [];

    // Build filter conditions
    if (filter.isActive !== undefined) {
      conditions.push(eq(featureCategories.isActive, filter.isActive));
    }
    if (filter.name) {
      conditions.push(ilike(featureCategories.name, `%${filter.name}%`));
    }
    if (filter.slug) {
      conditions.push(ilike(featureCategories.slug, `%${filter.slug}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(featureCategories)
      .where(whereClause);
    
    const total = totalResult[0]?.count || 0;

    // Get data with pagination
    const orderByClause = sortOrder === 'desc' 
      ? desc(featureCategories[sortBy]) 
      : asc(featureCategories[sortBy]);

    const data = await db
      .select()
      .from(featureCategories)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Mencari kategori berdasarkan pencarian teks
   * @param searchTerm - Term pencarian dalam nama atau deskripsi
   * @returns Promise array kategori yang cocok
   */
  async searchByText(searchTerm: string): Promise<SelectFeatureCategory[]> {
    return await db
      .select()
      .from(featureCategories)
      .where(
        and(
          eq(featureCategories.isActive, true),
          ilike(featureCategories.name, `%${searchTerm}%`)
        )
      )
      .orderBy(asc(featureCategories.sortOrder), asc(featureCategories.name));
  }

  /**
   * Mendapatkan urutan tertinggi untuk kategori baru
   * @returns Promise nomor urutan berikutnya
   */
  async getNextSortOrder(): Promise<number> {
    const result = await db
      .select({ maxOrder: featureCategories.sortOrder })
      .from(featureCategories)
      .orderBy(desc(featureCategories.sortOrder))
      .limit(1);
    
    return (result[0]?.maxOrder || 0) + 1;
  }

  /**
   * Mengupdate urutan kategori secara batch
   * @param updates - Array update dengan id dan sortOrder baru
   * @returns Promise boolean success
   */
  async updateSortOrders(updates: Array<{ id: number; sortOrder: number }>): Promise<boolean> {
    try {
      await db.transaction(async (tx) => {
        for (const update of updates) {
          await tx
            .update(featureCategories)
            .set({ 
              sortOrder: update.sortOrder,
              updatedAt: new Date()
            })
            .where(eq(featureCategories.id, update.id));
        }
      });
      return true;
    } catch (error) {
      console.error('Error updating sort orders:', error);
      return false;
    }
  }

  /**
   * Mengaktifkan/menonaktifkan kategori secara batch
   * @param ids - Array ID kategori
   * @param isActive - Status aktif yang diinginkan
   * @returns Promise boolean success
   */
  async bulkUpdateStatus(ids: number[], isActive: boolean): Promise<boolean> {
    try {
      for (const id of ids) {
        await db
          .update(featureCategories)
          .set({ 
            isActive,
            updatedAt: new Date()
          })
          .where(eq(featureCategories.id, id));
      }
      
      return true;
    } catch (error) {
      console.error('Error bulk updating status:', error);
      return false;
    }
  }

  /**
   * Override create method untuk auto-generate sortOrder
   * @param data - Data kategori baru
   * @returns Promise kategori yang dibuat
   */
  async create(data: Omit<InsertFeatureCategory, 'sortOrder'>): Promise<SelectFeatureCategory> {
    const nextSortOrder = await this.getNextSortOrder();
    
    const result = await db
      .insert(featureCategories)
      .values({
        ...data,
        sortOrder: nextSortOrder,
      })
      .returning();
    
    return result[0];
  }
}

/**
 * Factory function untuk membuat instance FeatureCategoriesRepository
 * Memudahkan dependency injection dan testing
 * 
 * @returns Instance FeatureCategoriesRepository yang siap digunakan
 */
export function createFeatureCategoriesRepository(): FeatureCategoriesRepository {
  return new FeatureCategoriesRepository();
}

/**
 * Default instance FeatureCategoriesRepository untuk penggunaan langsung
 * Dapat digunakan untuk backward compatibility
 */
export const featureCategoriesRepository = createFeatureCategoriesRepository();

/**
 * Alias untuk konsistensi penamaan
 */
export const FeatureCategoryRepository = featureCategoriesRepository;