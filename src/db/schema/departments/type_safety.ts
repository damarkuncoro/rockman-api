import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { departments } from "./table";

/**
 * Type Safety untuk Departments
 * 
 * Domain: User Management - Department Management
 * Responsibility: Menyediakan type safety untuk operasi database departemen
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani type definitions untuk departemen
 * - DRY: Reusable types untuk berbagai layer aplikasi
 * - KISS: Type definitions yang sederhana dan jelas
 * - SOLID: Type safety yang konsisten
 */

/**
 * Type untuk data departemen yang akan diinsert ke database
 * Digunakan untuk operasi CREATE
 */
export type InsertDepartment = InferInsertModel<typeof departments>;

/**
 * Type untuk data departemen yang diselect dari database
 * Digunakan untuk operasi READ
 */
export type SelectDepartment = InferSelectModel<typeof departments>;

/**
 * Type untuk update departemen
 * Menghilangkan id dan createdAt yang tidak boleh diupdate
 */
export type UpdateDepartment = Partial<Omit<InsertDepartment, 'id' | 'createdAt'>>;

/**
 * Type untuk create departemen
 * Menghilangkan field yang auto-generated
 */
export type CreateDepartment = Omit<InsertDepartment, 'id' | 'createdAt' | 'updatedAt' | 'sortOrder'>;

/**
 * Type untuk departemen dengan users
 * Digunakan untuk query yang include users
 */
export type DepartmentWithUsers = SelectDepartment & {
  users?: Array<{
    id: number;
    name: string;
    email: string;
  }>;
};

/**
 * Type untuk filter departemen
 * Digunakan untuk query dengan kondisi tertentu
 */
export type DepartmentFilter = {
  isActive?: boolean;
  name?: string;
  slug?: string;
  code?: string;
};

/**
 * Type untuk sorting departemen
 * Digunakan untuk query dengan order by
 */
export type DepartmentSortBy = 'name' | 'code' | 'createdAt' | 'updatedAt' | 'sortOrder';

/**
 * Type untuk pagination departemen
 * Digunakan untuk response API dengan pagination
 */
export type DepartmentPagination = {
  data: SelectDepartment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Export alias untuk backward compatibility
export type Department = SelectDepartment;
export type NewDepartment = InsertDepartment;