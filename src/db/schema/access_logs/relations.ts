

import { relations } from "drizzle-orm";
import { accessLogs } from "./table";
import { users } from "../users";
import { roles } from "../roles";
import { features } from "../features";

/**
 * Relations untuk access logs table
 * Menghubungkan dengan tabel users, roles, dan features
 * 
 * Domain: Access Monitoring
 * Responsibility: Mendefinisikan relasi antar tabel untuk access logs
 */
export const accessLogsRelations = relations(accessLogs, ({ one }) => ({
  user: one(users, {
    fields: [accessLogs.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [accessLogs.roleId],
    references: [roles.id],
  }),
  feature: one(features, {
    fields: [accessLogs.featureId],
    references: [features.id],
  }),
}));
