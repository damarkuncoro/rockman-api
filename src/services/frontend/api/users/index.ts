


/**
 * API service untuk users dengan CRUD operations
 * Menggunakan Core API resources untuk konsistensi
 * 
 * Domain: User Management - Frontend API
 * Responsibility: Export semua operasi users (CRUD, email, password, query builder)
 * 
 * Struktur Direktori:
 * - client/: Operasi frontend (query builder, API calls)
 * - server/: Operasi backend (handlers, middleware) - placeholder
 * - shared/: Utilities bersama (validasi, types, constants)
 * - email/: Modul email dengan struktur client/server/shared
 * - password/: Modul password dengan struktur client/server/shared
 * 
 * Struktur Organisasi:
 * - CRUD operations: Traditional dan Query Builder Pattern
 * - Email operations: Terorganisir dalam folder email/ (endpoint, validation)
 * - Password operations: Dalam file password.ts
 * - Validation operations: Struktur hierarkis dalam shared/validation.ts
 * 
 * Mengikuti prinsip SOLID:
 * - SRP: Setiap modul memiliki tanggung jawab tunggal
 * - OCP: Mudah diperluas tanpa mengubah kode existing
 * - LSP: Interface yang konsisten
 * - ISP: Interface yang spesifik untuk setiap domain
 * - DIP: Dependency pada abstraksi, bukan implementasi konkret
 */

/**
 * API service untuk users dengan CRUD operations
 * Menggunakan Core API resources untuk konsistensi
 * 
 * Domain: User Management - Frontend API
 * Responsibility: Export semua operasi users (CRUD, email, password, query builder)
 * 
 * Struktur Direktori:
 * - client/: Operasi frontend (query builder, API calls)
 * - server/: Operasi backend (handlers, middleware) - placeholder
 * - shared/: Utilities bersama (validasi, types, constants)
 * - email/: Modul email dengan struktur client/server/shared
 * - password/: Modul password dengan struktur client/server/shared
 * 
 * Struktur Organisasi:
 * - CRUD operations: Traditional dan Query Builder Pattern
 * - Email operations: Terorganisir dalam folder email/ (endpoint, validation)
 * - Password operations: Dalam file password.ts
 * - Validation operations: Struktur hierarkis dalam shared/validation.ts
 * 
 * Mengikuti prinsip SOLID:
 * - SRP: Setiap modul memiliki tanggung jawab tunggal
 * - OCP: Mudah diperluas tanpa mengubah kode existing
 * - LSP: Interface yang konsisten
 * - ISP: Interface yang spesifik untuk setiap domain
 * - DIP: Dependency pada abstraksi, bukan implementasi konkret
 */

import { resources } from '@/core/core.api'
import type { UserProfileData } from './shared/types'
import { createUsersQueryBuilder, API as ClientAPI } from './client'
import { EmailAPI } from '../email'
import { PasswordClientAPI } from '../password'
import { VALIDATE } from './shared'

// Membuat instance query builder
const queryBuilder = createUsersQueryBuilder('/api/v1/users')

export const API = {
  users: {
    // Traditional CRUD operations
    ...resources<UserProfileData>('/api/v1/users'),
    
    // Query Builder Pattern - mendukung chaining API calls dengan override GET
    GET: {
      // Traditional CRUD methods
      ...resources<UserProfileData>('/api/v1/users').GET,
      
      // Query Builder methods
      ID: queryBuilder.GET.ID.bind(queryBuilder.GET),
      all: queryBuilder.GET.all.bind(queryBuilder.GET)
    },
    
    // Email operations - Menggunakan struktur folder email yang terorganisir
    ...EmailAPI,
    
    // Password operations
    ...PasswordClientAPI,
    
    // Client API operations - Menggunakan client module
    ...ClientAPI,
    
    // Validation operations - Struktur hierarkis
    VALIDATE
  }
}

// Re-export types untuk kemudahan import - Menggunakan struktur folder email
// export type { User } from '@/db/schema/users' // Commented out untuk menghindari import database di client-side
export type { 
  ChangeEmailRequest, 
  VerifyEmailRequest,
  UpdateEmailRequest,
  UpdateEmailResponse,
  EmailStatusResponse
} from '../email'
export type {
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  PasswordStatusResponse,
  PasswordStrengthResult
} from '../password'

/**
 * Contoh penggunaan di komponen:
 * 
 * // QUERY BUILDER PATTERN (NEW)
 * // Update email user dengan ID 1 menggunakan query builder
 * const result = await API.users.GET.ID(1).email.PUT.value("example.com")
 * 
 * // Get user by ID menggunakan query builder
 * const user = await API.users.GET.ID(1).execute()
 * 
 * // Get user email menggunakan query builder
 * const email = await API.users.GET.ID(1).email.execute()
 * 
 * // Get all users menggunakan query builder
 * const allUsers = await API.users.GET.all()
 * 
 * // TRADITIONAL CRUD OPERATIONS (EXISTING)
 * // GET all users
 * const users = await API.users.GET.all()
 * 
 * // GET user by ID
 * const user = await API.users.GET.byId(1)
 * 
 * // CREATE new user
 * const newUser = await API.users.POST.create({ 
 *   name: "John Doe",
 *   email: "john@example.com",
 *   passwordHash: "hashed_password"
 * })
 * 
 * // UPDATE user
 * const updatedUser = await API.users.PUT.update(1, { 
 *   name: "Jane Doe",
 *   email: "jane@example.com" 
 * })
 * 
 * // DELETE user
 * await API.users.DELETE.remove(1)
 * 
 * // CHANGE EMAIL
 * const changeEmailResult = await API.users.changeEmail(1, {
 *   currentPassword: "current_password",
 *   newEmail: "new@example.com"
 * })
 * 
 * // VERIFY EMAIL
 * const verifyEmailResult = await API.users.verifyEmail(1, {
 *   verificationCode: "123456"
 * })
 * 
 * // VALIDATION OPERATIONS (NEW HIERARCHICAL STRUCTURE)
 * // Validasi Required
 * const isEmailRequired = API.users.VALIDATE.Required.email("test@example.com")
 * const isPasswordRequired = API.users.VALIDATE.Required.password("myPassword")
 * 
 * // Validasi Format
 * const isEmailFormatValid = API.users.VALIDATE.Format.email("test@example.com")
 * const isPhoneFormatValid = API.users.VALIDATE.Format.phone("+6281234567890")
 * 
 * // Validasi Strength
 * const passwordStrength = API.users.VALIDATE.Strength.password("MyPassword123!")
 * console.log(passwordStrength.isStrong) // true/false
 * 
 * // Validasi Length
 * const isPasswordLengthValid = API.users.VALIDATE.Length.password("myPassword", 8)
 * const isNameLengthValid = API.users.VALIDATE.Length.name("John", 2)
 * 
 * // Validasi Match
 * const isPasswordMatch = API.users.VALIDATE.Match.password("password", "password")
 * 
 * // Utility Functions
 * const strengthMessage = API.users.VALIDATE.Utils.getPasswordStrengthMessage("MyPass123!")
 * const emailValidation = API.users.VALIDATE.Utils.validateEmailComplete("test@example.com")
 * const passwordValidation = API.users.VALIDATE.Utils.validatePasswordComplete("MyPass123!")
 */
