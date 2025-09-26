import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { featureCategories } from "./table";

/**
 * Type Safety untuk Feature Categories
 * 
 * Domain: RBAC - Feature Management
 * Responsibility: Menyediakan type safety untuk operasi database kategori fitur
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani type definitions untuk kategori fitur
 * - DRY: Reusable types untuk berbagai layer aplikasi
 * - KISS: Type definitions yang sederhana dan jelas
 * - SOLID: Type safety yang konsisten
 */

/**
 * Type untuk data kategori fitur yang akan diinsert ke database
 * Digunakan untuk operasi CREATE
 */
export type InsertFeatureCategory = InferInsertModel<typeof featureCategories>;

/**
 * Type untuk data kategori fitur yang diselect dari database
 * Digunakan untuk operasi READ
 */
export type SelectFeatureCategory = InferSelectModel<typeof featureCategories>;

/**
 * Type untuk update kategori fitur
 * Semua field optional kecuali yang required untuk update
 */
export type UpdateFeatureCategory = Partial<Omit<InsertFeatureCategory, 'id' | 'createdAt'>>;

/**
 * Type untuk create kategori fitur
 * Menghilangkan field yang auto-generated
 */
export type CreateFeatureCategory = Omit<InsertFeatureCategory, 'id' | 'createdAt' | 'updatedAt' | 'sortOrder'>;

/**
 * Type untuk kategori fitur dengan informasi tambahan
 * Digunakan untuk response API yang membutuhkan data relasi
 */
export type FeatureCategoryWithFeatures = SelectFeatureCategory & {
  features?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
};

/**
 * Type untuk filter kategori fitur
 * Digunakan untuk query dengan kondisi tertentu
 */
export type FeatureCategoryFilter = {
  isActive?: boolean;
  name?: string;
  slug?: string;
};

/**
 * Type untuk sorting kategori fitur
 * Digunakan untuk pengurutan data
 */
export type FeatureCategorySortBy = 'name' | 'createdAt' | 'updatedAt' | 'sortOrder';

/**
 * Type untuk pagination kategori fitur
 * Digunakan untuk response API dengan pagination
 */
export type FeatureCategoryPagination = {
  data: SelectFeatureCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};