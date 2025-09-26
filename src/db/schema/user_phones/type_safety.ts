import { userPhones } from "./table";

/**
 * TypeScript types untuk type safety user phones
 * 
 * Domain: User Management - Phone Numbers
 * Responsibility: Menyediakan type safety untuk nomor telepon user
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani type safety untuk phone numbers
 * - DRY: Reusable types untuk seluruh aplikasi
 * - KISS: Type definitions yang sederhana
 * - SOLID: Type safety yang konsisten
 */
export type UserPhone = typeof userPhones.$inferSelect;
export type NewUserPhone = typeof userPhones.$inferInsert;