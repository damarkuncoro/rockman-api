/**
 * Users Schema Module
 * 
 * Domain: User Management
 * Responsibility: Mengelola data pengguna dan atribut ABAC
 * 
 * Struktur modular dengan Separation of Concerns:
 * - table.ts: Database schema definition
 * - relations.ts: Database relations
 * - type_safety.ts: TypeScript types
 * - validations/data_validation.ts: Data layer validation
 * - validations/api_validation.ts: API layer validation
 */

// Database Schema
export { users } from "./table";

// Relations
export { usersRelations } from "./relations";

// Type Safety
export type { User, NewUser } from "./type_safety";

// Data layer validations
export {
  insertUserDataSchema,
  selectUserDataSchema,
  emailSchema,
  passwordSchema,
  nameSchema,
  usernameSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  type InsertUserData,
  type SelectUserData,
} from "./validations/data_validation";

// API Layer Validations
export {
  createUserSchema,
  loginSchema,
  updateUserAbacSchema,
  type CreateUserInput,
  type LoginInput,
  type UpdateUserAbacInput,
} from "./validations/api_validation";