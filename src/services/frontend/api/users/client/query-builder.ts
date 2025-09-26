/**
 * Query Builder untuk Users API
 * 
 * Domain: User Management - Query Builder
 * Responsibility: Menyediakan interface fluent untuk operasi API users
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani query building untuk users API
 * - DRY: Reusable query builder pattern
 * - KISS: Interface yang sederhana dan intuitif
 * - SOLID: Dependency injection dan separation of concerns
 * 
 * @example
 * // Update email user dengan ID 1
 * await API.users.GET.ID(1).email.PUT.value("example.com")
 * 
 * // Get user by ID
 * const user = await API.users.GET.ID(1).execute()
 * 
 * // Get user email
 * const email = await API.users.GET.ID(1).email.execute()
 */

import { fetcher } from '@/core/core.api'
import type { UserProfileData } from '../shared/types'
// import { User } from '@/db/schema/users' // Commented out untuk menghindari import database di client-side

/**
 * Interface untuk response update email
 */
export interface EmailUpdateResponse {
  id: number
  email: string
  updatedAt: string
  message: string
}

/**
 * Base Query Builder Class
 * Menyediakan foundation untuk semua query operations
 */
abstract class BaseQueryBuilder {
  protected baseUrl: string
  protected userId?: number
  protected field?: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Set user ID untuk query
   * @param id - User ID
   * @returns QueryBuilder instance untuk chaining
   */
  abstract ID(id: number): UserQueryBuilder
}

/**
 * Email Query Builder Class
 * Menangani operasi khusus untuk email field
 */
class EmailQueryBuilder {
  private baseUrl: string
  private userId: number

  constructor(baseUrl: string, userId: number) {
    this.baseUrl = baseUrl
    this.userId = userId
  }

  /**
   * PUT operations untuk email
   */
  get PUT() {
    return {
      /**
       * Update email dengan value baru
       * @param email - Email baru yang akan diset
       * @returns Promise response dari API
       */
      value: async (email: string): Promise<EmailUpdateResponse> => {
        const response = await fetcher<UserProfileData>(`${this.baseUrl}/${this.userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
          internal: false
        })

        return {
          id: (response as EmailUpdateResponse).id,
          email: (response as EmailUpdateResponse).email,
          updatedAt: (response as EmailUpdateResponse).updatedAt || new Date().toISOString(),
          message: 'Email berhasil diupdate'
        }
      }
    }
  }

  /**
   * Execute query untuk mendapatkan email value
   * @returns Promise email value
   */
  async execute(): Promise<string> {
    const user = await fetcher<UserProfileData>(`${this.baseUrl}/${this.userId}`, {
      internal: false
    })
    return user.email || ''
  }
}

/**
 * User Query Builder Class
 * Menangani operasi untuk user berdasarkan ID
 */
class UserQueryBuilder {
  private baseUrl: string
  private userId: number

  constructor(baseUrl: string, userId: number) {
    this.baseUrl = baseUrl
    this.userId = userId
  }

  /**
   * Email field operations
   * @returns EmailQueryBuilder instance untuk chaining
   */
  get email(): EmailQueryBuilder {
    return new EmailQueryBuilder(this.baseUrl, this.userId)
  }

  /**
   * Execute query untuk mendapatkan user data
   * @returns Promise user data
   */
  async execute(): Promise<UserProfileData> {
    return await fetcher<UserProfileData>(`${this.baseUrl}/${this.userId}`, {
      internal: false
    })
  }
}

/**
 * GET Query Builder Class
 * Menangani operasi GET untuk users
 */
class GetQueryBuilder extends BaseQueryBuilder {
  /**
   * Set user ID untuk query
   * @param id - User ID
   * @returns UserQueryBuilder instance untuk chaining
   */
  ID(id: number): UserQueryBuilder {
    return new UserQueryBuilder(this.baseUrl, id)
  }

  /**
   * Get all users
   * @returns Promise array of users
   */
  async all(): Promise<UserProfileData[]> {
    return await fetcher<UserProfileData[]>(this.baseUrl, { internal: false })
  }
}

/**
 * Main Users Query Builder Class
 * Entry point untuk semua operasi users API
 */
export class UsersQueryBuilder {
  private baseUrl: string

  constructor(baseUrl: string = '/api/v1/users') {
    this.baseUrl = baseUrl
  }

  /**
   * GET operations
   * @returns GetQueryBuilder instance untuk chaining
   */
  get GET(): GetQueryBuilder {
    return new GetQueryBuilder(this.baseUrl)
  }
}

/**
 * Factory function untuk membuat Users Query Builder
 * @param baseUrl - Base URL untuk users API
 * @returns UsersQueryBuilder instance
 */
export function createUsersQueryBuilder(baseUrl: string = '/api/v1/users'): UsersQueryBuilder {
  return new UsersQueryBuilder(baseUrl)
}