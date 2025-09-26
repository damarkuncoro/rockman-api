import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";

/**
 * Tabel features untuk menyimpan daftar fitur/permission dalam sistem
 * Digunakan untuk RBAC (Role-Based Access Control)
 * 
 * Domain: RBAC
 * Responsibility: Mengelola fitur dan permission sistem
 */
export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  categoryId: integer("category_id").references(() => featureCategories.id),
  // Deprecated: Kolom category lama, akan dihapus setelah migrasi
  category: varchar("category", { length: 50 }).default("General"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Import feature categories untuk foreign key reference
import { featureCategories } from "../feature_categories/table";