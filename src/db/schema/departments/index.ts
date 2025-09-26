/**
 * Departments Schema Index
 * 
 * Domain: User Management - Department Management
 * Responsibility: Central export untuk semua schema dan types departemen
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani exports untuk departemen
 * - DRY: Single source of truth untuk imports
 * - KISS: Export yang sederhana dan terorganisir
 * - SOLID: Separation of concerns untuk schema management
 */

// Table schema exports
export { departments } from "./table";

// Relations exports
export { departmentsRelations } from "./relations";

// Type safety exports
export type {
  InsertDepartment,
  SelectDepartment,
  UpdateDepartment,
  CreateDepartment,
  DepartmentWithUsers,
  DepartmentFilter,
  DepartmentSortBy,
  DepartmentPagination,
  Department,
  NewDepartment,
} from "./type_safety";

// Data validation exports
export {
  insertDepartmentDataSchema,
  updateDepartmentDataSchema,
  selectDepartmentDataSchema,
  departmentFilterSchema,
  departmentSortSchema,
  departmentPaginationSchema,
  type InsertDepartmentData,
  type UpdateDepartmentData,
  type SelectDepartmentData,
  type DepartmentFilter as DepartmentFilterData,
  type DepartmentSort,
  type DepartmentPagination as DepartmentPaginationData,
} from "./validations/data_validation";

// API validation exports
export {
  createDepartmentSchema,
  updateDepartmentApiSchema,
  departmentIdSchema,
  departmentQuerySchema,
  bulkDepartmentSchema,
  reorderDepartmentSchema,
  assignUserToDepartmentSchema,
  bulkAssignUsersToDepartmentSchema,
} from "./validations/api_validation";

// API validation types exports
export type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentIdInput,
  DepartmentQueryInput,
  BulkDepartmentInput,
  ReorderDepartmentInput,
  AssignUserToDepartmentInput,
  BulkAssignUsersToDepartmentInput,
} from "./validations/api_validation";