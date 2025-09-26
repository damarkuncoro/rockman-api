import { pgTable, serial, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

/**
 * Tabel feature_categories untuk mengelola kategori fitur dalam sistem
 * Digunakan untuk mengorganisir dan mengelompokkan features berdasarkan kategori
 * 
 * Domain: RBAC - Feature Management
 * Responsibility: Mengelola kategori fitur untuk organisasi yang lebih baik
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani data kategori fitur
 * - DRY: Reusable category system untuk berbagai fitur
 * - KISS: Struktur tabel yang sederhana dan mudah dipahami
 * - SOLID: Single responsibility untuk kategori management
 */
export const featureCategories = pgTable("feature_categories", {
  /**
   * Primary key untuk kategori fitur
   * Auto-increment serial untuk unique identification
   */
  id: serial("id").primaryKey(),

  /**
   * Nama kategori fitur
   * Unique untuk mencegah duplikasi kategori
   * Max 100 karakter untuk fleksibilitas penamaan
   */
  name: varchar("name", { length: 100 }).notNull().unique(),

  /**
   * Deskripsi kategori fitur
   * Optional field untuk memberikan konteks lebih detail
   */
  description: text("description"),

  /**
   * Slug untuk URL-friendly identifier
   * Digunakan untuk routing dan API endpoints
   * Unique dan lowercase
   */
  slug: varchar("slug", { length: 100 }).notNull().unique(),

  /**
   * Warna kategori untuk UI/UX
   * Hex color code untuk konsistensi visual
   * Default ke primary color
   */
  color: varchar("color", { length: 7 }).default("#3B82F6"),

  /**
   * Icon kategori untuk UI/UX
   * Nama icon dari icon library (contoh: Tabler Icons)
   */
  icon: varchar("icon", { length: 50 }).default("IconSettings"),

  /**
   * Status aktif/non-aktif kategori
   * Untuk soft delete dan management kategori
   */
  isActive: boolean("is_active").default(true).notNull(),

  /**
   * Urutan tampilan kategori
   * Untuk sorting dan prioritas tampilan
   */
  sortOrder: serial("sort_order"),

  /**
   * Timestamp pembuatan kategori
   * Auto-generated saat record dibuat
   */
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),

  /**
   * Timestamp update terakhir
   * Auto-updated saat record dimodifikasi
   */
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});