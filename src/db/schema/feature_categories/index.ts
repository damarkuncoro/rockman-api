/**
 * Feature Categories Schema Index
 * 
 * Domain: RBAC - Feature Management
 * Responsibility: Central export untuk semua schema dan types kategori fitur
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani exports untuk kategori fitur
 * - DRY: Single source of truth untuk imports
 * - KISS: Export yang sederhana dan terorganisir
 * - SOLID: Separation of concerns untuk schema management
 */

// Table schema exports
export { featureCategories } from "./table";

// Relations exports
export { featureCategoriesRelations } from "./relations";

// Type safety exports
export type {
  InsertFeatureCategory,
  SelectFeatureCategory,
  UpdateFeatureCategory,
  CreateFeatureCategory,
  FeatureCategoryWithFeatures,
  FeatureCategoryFilter,
  FeatureCategorySortBy,
  FeatureCategoryPagination,
} from "./type_safety";

// Data validation exports
export {
  insertFeatureCategorySchema,
  updateFeatureCategorySchema,
  selectFeatureCategorySchema,
  featureCategoryFilterSchema,
  featureCategorySortSchema,
  featureCategoryPaginationSchema,
} from "./validations/data_validation";

// API validation exports
export {
  createFeatureCategorySchema,
  updateFeatureCategoryApiSchema,
  featureCategoryIdSchema,
  featureCategoryQuerySchema,
  bulkFeatureCategorySchema,
  reorderFeatureCategorySchema,
} from "./validations/api_validation";

export type {
  CreateFeatureCategoryInput,
  UpdateFeatureCategoryInput,
  FeatureCategoryIdInput,
  FeatureCategoryQueryInput,
  BulkFeatureCategoryInput,
  ReorderFeatureCategoryInput,
} from "./validations/api_validation";