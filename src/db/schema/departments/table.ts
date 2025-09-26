import { pgTable, serial, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

/**
 * Tabel departments untuk mengelola departemen dalam organisasi
 * Digunakan untuk mengorganisir dan mengelompokkan users berdasarkan departemen
 * 
 * Domain: User Management - Department Management
 * Responsibility: Mengelola data departemen untuk organisasi yang lebih baik
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani data departemen
 * - DRY: Reusable department system untuk berbagai keperluan
 * - KISS: Struktur tabel yang sederhana dan mudah dipahami
 * - SOLID: Single responsibility untuk department management
 */
export const departments = pgTable("departments", {
  /**
   * Primary key untuk departemen
   * Auto-increment serial untuk unique identification
   */
  id: serial("id").primaryKey(),

  /**
   * Nama departemen
   * Unique untuk mencegah duplikasi departemen
   * Max 100 karakter untuk fleksibilitas penamaan
   */
  name: varchar("name", { length: 100 }).notNull().unique(),

  /**
   * Deskripsi departemen
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
   * Kode departemen
   * Kode singkat untuk identifikasi departemen (contoh: IT, HR, FIN)
   * Max 10 karakter, uppercase
   */
  code: varchar("code", { length: 10 }).notNull().unique(),

  /**
   * Warna departemen untuk UI/UX
   * Hex color code untuk konsistensi visual
   * Default ke primary color
   */
  color: varchar("color", { length: 7 }).default("#3B82F6"),

  /**
   * Icon departemen untuk UI/UX
   * Nama icon dari icon library (contoh: Tabler Icons)
   */
  icon: varchar("icon", { length: 50 }).default("IconBuilding"),

  /**
   * Status aktif/non-aktif departemen
   * Untuk soft delete dan management departemen
   */
  isActive: boolean("is_active").default(true).notNull(),

  /**
   * Urutan tampilan departemen
   * Untuk sorting dan prioritas tampilan
   */
  sortOrder: serial("sort_order"),

  /**
   * Timestamp pembuatan departemen
   * Auto-generated saat record dibuat
   */
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),

  /**
   * Timestamp update terakhir
   * Auto-updated saat record dimodifikasi
   */
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});