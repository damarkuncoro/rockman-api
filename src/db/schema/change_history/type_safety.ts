import { changeHistory } from "./table";

/**
 * TypeScript types untuk type safety change history
 * 
 * Domain: Change Tracking
 * Responsibility: Menyediakan type definitions untuk change history
 * 
 * @description Types yang di-infer dari schema untuk:
 * - Type safety pada operasi database
 * - Konsistensi data structure
 * - IntelliSense support
 * - Compile-time validation
 */

/**
 * Type untuk data change history yang sudah ada (select)
 * Digunakan saat mengambil data dari database
 */
export type ChangeHistory = typeof changeHistory.$inferSelect;

/**
 * Type untuk data change history baru (insert)
 * Digunakan saat membuat record baru
 */
export type NewChangeHistory = typeof changeHistory.$inferInsert;