/**
 * User Addresses Schema Module
 * 
 * Domain: User Management
 * Responsibility: Mengelola alamat user dengan dukungan alamat default
 */

// Table definition
export { userAddresses } from "./table";

// Relations
export { userAddressesRelations } from "./relations";

// Type safety
export type { UserAddress, NewUserAddress } from "./type_safety";

// API validations
export {
  createUserAddressSchema,
  updateUserAddressSchema,
  setDefaultAddressSchema,
  type CreateUserAddressInput,
  type UpdateUserAddressInput,
  type SetDefaultAddressInput,
} from "./validations/api_validation";

// Data validations
export {
  validateDefaultAddress,
  validateIndonesianPhoneNumber,
  validateIndonesianPostalCode,
  validateCompleteAddress,
} from "./validations/data_validation";