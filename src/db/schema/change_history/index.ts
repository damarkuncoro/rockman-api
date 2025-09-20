/**
 * Change History Schema Barrel Exports
 * 
 * Domain: Change Tracking
 * Responsibility: Centralized exports untuk change history schema
 * 
 * @description Barrel pattern untuk:
 * - Single import point untuk semua change history exports
 * - Clean import statements di consumer files
 * - Encapsulation of internal structure
 * - Easier refactoring dan maintenance
 */

// Table definition dan relations
export { changeHistory } from "./table";
export { changeHistoryRelations } from "./relations";

// Type safety
export type { ChangeHistory, NewChangeHistory } from "./type_safety";

// Data layer validations
export {
  insertChangeHistorySchema,
  selectChangeHistorySchema,
  createRequiredStringSchema,
  createOptionalStringSchema,
  type InsertChangeHistoryInput,
  type SelectChangeHistoryInput,
} from "./validations/data_validation";

// Validations - API Layer
export {
  createChangeHistorySchema,
} from "./validations/api_validation";

export type {
  CreateChangeHistoryInput,
} from "./validations/api_validation";