import { pgTable, serial, integer, varchar } from "drizzle-orm/pg-core";
import { features } from "../features";

/**
 * Tabel route_features untuk menyimpan mapping route ke feature
 * Digunakan untuk menentukan feature apa yang diperlukan untuk mengakses route tertentu
 * 
 * Domain: RBAC
 * Responsibility: Mengelola mapping antara route dan feature yang diperlukan
 */
export const routeFeatures = pgTable("route_features", {
  id: serial("id").primaryKey(),
  path: varchar("path", { length: 255 }).notNull(),
  method: varchar("method", { length: 10 }),
  featureId: integer("feature_id").notNull().references(() => features.id, { onDelete: "cascade" }),
});