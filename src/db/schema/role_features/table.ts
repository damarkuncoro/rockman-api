import { pgTable, serial, integer, boolean } from "drizzle-orm/pg-core";
import { roles } from "../roles";
import { features } from "../features";

/**
 * Tabel role_features untuk menyimpan permission role terhadap feature
 * Junction table untuk many-to-many relationship antara roles dan features
 * 
 * Domain: RBAC
 * Responsibility: Mengelola permission CRUD untuk setiap role-feature combination
 */
export const roleFeatures = pgTable("role_features", {
  id: serial("id").primaryKey(),
  roleId: integer("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  featureId: integer("feature_id").notNull().references(() => features.id, { onDelete: "cascade" }),
  canCreate: boolean("can_create").default(false),
  canRead: boolean("can_read").default(false),
  canUpdate: boolean("can_update").default(false),
  canDelete: boolean("can_delete").default(false),
});