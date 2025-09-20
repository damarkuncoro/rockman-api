


import { resources } from '@/core/core.api'
import type { User } from '@/db/schema/users'

/**
 * API service untuk users dengan CRUD operations
 * Menggunakan Core API resources untuk konsistensi
 * 
 * Domain: User Management - Frontend API
 * Responsibility: Menyediakan interface untuk operasi CRUD users
 */
export const API = {
  users: resources<User>('/api/v1/users')
}

/**
 * Contoh penggunaan di komponen:
 * 
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
 */
