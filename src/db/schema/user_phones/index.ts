/**
 * User Phones Schema Module
 * 
 * Domain: User Management - Phone Numbers
 * Responsibility: Central export untuk semua komponen user phones
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani export untuk user phones
 * - DRY: Single point of export
 * - KISS: Export yang sederhana dan jelas
 */

// Table schema
export { userPhones } from './table';

// Relations
export { userPhonesRelations } from './relations';

// Type safety
export type { UserPhone, NewUserPhone } from './type_safety';

// Validations
export {
  validateDefaultPhone,
  validateIndonesianPhoneNumber,
  validateInternationalPhoneNumber,
  validatePhoneDuplication,
  validatePhoneLabel
} from './validations/data_validation';

export {
  createUserPhoneSchema,
  updateUserPhoneSchema,
  setDefaultPhoneSchema,
  verifyPhoneSchema,
  bulkPhoneSchema,
  type CreateUserPhoneInput,
  type UpdateUserPhoneInput,
  type SetDefaultPhoneInput,
  type VerifyPhoneInput,
  type BulkPhoneInput
} from './validations/api_validation';