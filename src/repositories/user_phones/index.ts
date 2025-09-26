/**
 * User Phones Repository Module
 * 
 * Domain: User Management - Phone Numbers Repository
 * Responsibility: Central export untuk repository user phones
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani export untuk user phones repository
 * - DRY: Single point of export
 * - KISS: Export yang sederhana dan jelas
 */

// Repository class dan instances
export {
  UserPhonesRepository,
  createUserPhonesRepository,
  userPhonesRepository,
  UserPhoneRepository
} from './user_phones.repository';