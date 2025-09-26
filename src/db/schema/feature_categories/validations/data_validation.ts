import { z } from "zod";

/**
 * Data validation schemas untuk feature categories
 * 
 * Domain: RBAC - Feature Management
 * Responsibility: Validasi data kategori fitur untuk konsistensi dan keamanan
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani validasi data kategori fitur
 * - DRY: Reusable validation schemas
 * - KISS: Validasi yang sederhana dan jelas
 * - SOLID: Separation of concerns untuk data validation
 */

/**
 * Schema validasi untuk nama kategori
 * Nama harus unik, tidak kosong, dan memiliki panjang yang sesuai
 */
const categoryNameSchema = z
  .string()
  .min(1, "Nama kategori tidak boleh kosong")
  .max(100, "Nama kategori maksimal 100 karakter")
  .regex(/^[a-zA-Z0-9\s\-_]+$/, "Nama kategori hanya boleh mengandung huruf, angka, spasi, tanda hubung, dan underscore");

/**
 * Schema validasi untuk slug kategori
 * Slug harus URL-friendly dan unik
 */
const categorySlugSchema = z
  .string()
  .min(1, "Slug kategori tidak boleh kosong")
  .max(100, "Slug kategori maksimal 100 karakter")
  .regex(/^[a-z0-9\-_]+$/, "Slug harus lowercase dan hanya mengandung huruf, angka, tanda hubung, dan underscore");

/**
 * Schema validasi untuk warna kategori
 * Harus berupa hex color code yang valid
 */
const categoryColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Warna harus berupa hex color code yang valid (contoh: #3B82F6)")
  .default("#3B82F6");

/**
 * Schema validasi untuk icon kategori
 * Nama icon dari icon library
 */
const categoryIconSchema = z
  .string()
  .min(1, "Icon kategori tidak boleh kosong")
  .max(50, "Icon kategori maksimal 50 karakter")
  .regex(/^[a-zA-Z0-9]+$/, "Icon hanya boleh mengandung huruf dan angka")
  .default("IconSettings");

/**
 * Schema validasi untuk deskripsi kategori
 * Optional field dengan batasan panjang
 */
const categoryDescriptionSchema = z
  .string()
  .max(500, "Deskripsi kategori maksimal 500 karakter")
  .optional();

/**
 * Schema validasi untuk status aktif kategori
 */
const categoryIsActiveSchema = z
  .boolean()
  .default(true);

/**
 * Schema validasi untuk urutan kategori
 */
const categorySortOrderSchema = z
  .number()
  .int("Urutan harus berupa bilangan bulat")
  .min(0, "Urutan tidak boleh negatif")
  .optional();

/**
 * Schema validasi untuk insert kategori fitur
 * Digunakan saat membuat kategori baru
 */
export const insertFeatureCategorySchema = z.object({
  name: categoryNameSchema,
  description: categoryDescriptionSchema,
  slug: categorySlugSchema,
  color: categoryColorSchema,
  icon: categoryIconSchema,
  isActive: categoryIsActiveSchema,
  sortOrder: categorySortOrderSchema,
});

/**
 * Schema validasi untuk update kategori fitur
 * Semua field optional untuk partial update
 */
export const updateFeatureCategorySchema = z.object({
  name: categoryNameSchema.optional(),
  description: categoryDescriptionSchema,
  slug: categorySlugSchema.optional(),
  color: categoryColorSchema.optional(),
  icon: categoryIconSchema.optional(),
  isActive: categoryIsActiveSchema.optional(),
  sortOrder: categorySortOrderSchema,
});

/**
 * Schema validasi untuk select kategori fitur
 * Digunakan untuk validasi data yang diambil dari database
 */
export const selectFeatureCategorySchema = insertFeatureCategorySchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Schema validasi untuk filter kategori fitur
 * Digunakan untuk query dengan kondisi tertentu
 */
export const featureCategoryFilterSchema = z.object({
  isActive: z.boolean().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
});

/**
 * Schema validasi untuk sorting kategori fitur
 */
export const featureCategorySortSchema = z.enum(['name', 'createdAt', 'updatedAt', 'sortOrder']);

/**
 * Schema validasi untuk pagination
 */
export const featureCategoryPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: featureCategorySortSchema.default('sortOrder'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});