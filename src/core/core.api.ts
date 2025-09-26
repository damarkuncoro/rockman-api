/**
 * Core API Module
 * 
 * Domain: Core Infrastructure - API Client
 * Responsibility: Menyediakan utility untuk HTTP requests dan CRUD operations
 * 
 * Mengikuti prinsip:
 * - DRY: Reusable API functions
 * - KISS: Simple and clean interface
 * - SOLID: Single responsibility untuk setiap function
 */

// Base URL configuration untuk API calls
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000" // fallback dev

/**
 * Generic fetcher function untuk HTTP requests
 * Mendukung internal API calls dengan automatic base URL
 * 
 * @param url - URL endpoint yang akan dipanggil
 * @param options - Request options dengan tambahan revalidate dan internal flags
 * @returns Promise dengan response data bertipe T
 * 
 * @example
 * // External API call
 * const data = await fetcher<User>('https://api.example.com/users/1')
 * 
 * // Internal API call (otomatis menambahkan BASE_URL)
 * const user = await fetcher<User>('/api/users/1', { internal: true })
 * 
 * // Dengan revalidation untuk Next.js caching
 * const users = await fetcher<User[]>('/api/users', { 
 *   internal: true, 
 *   revalidate: 60 
 * })
 */
export async function fetcher<T>(
  url: string,
  options?: RequestInit & { revalidate?: number; internal?: boolean }
): Promise<T> {
  // Kalau internal = true, otomatis tambahkan BASE_URL
  const finalUrl = options?.internal
    ? `${BASE_URL}${url.startsWith("/") ? url : "/" + url}`
    : url

  const res = await fetch(finalUrl, {
    ...(options?.revalidate
      ? { next: { revalidate: options.revalidate } }
      : { cache: "no-store" }),
    ...options,
  })

  if (!res.ok) {
    throw new Error(`Fetch error ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

/**
 * Factory function untuk membuat CRUD resources
 * Menyediakan method GET, POST, PUT, DELETE yang konsisten
 * 
 * @param baseUrl - Base URL untuk resource (contoh: '/api/users')
 * @param internal - Flag untuk menentukan apakah menggunakan internal API
 * @returns Object dengan method CRUD yang siap pakai
 * 
 * @example
 * // Membuat API service untuk users
 * const usersAPI = resources<User>('/api/users', true)
 * 
 * // GET operations
 * const allUsers = await usersAPI.GET.all()
 * const user = await usersAPI.GET.byId(1)
 * const cachedUsers = await usersAPI.GET.all(60) // cache 60 detik
 * 
 * // POST operation
 * const newUser = await usersAPI.POST.create({
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * })
 * 
 * // PUT operation
 * const updatedUser = await usersAPI.PUT.update(1, {
 *   name: 'Jane Doe'
 * })
 * 
 * // DELETE operation
 * const result = await usersAPI.DELETE.remove(1)
 * 
 * @example
 * // Penggunaan dengan custom methods (seperti di users API service)
 * const API = {
 *   users: {
 *     ...resources<User>('/api/v1/users'),
 *     
 *     // Custom methods untuk operasi khusus
 *     changeEmail: async (userId: number, data: ChangeEmailRequest) => {
 *       const response = await fetch(`/api/v1/users/${userId}/email/change`, {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify(data),
 *       })
 *       return response.json()
 *     }
 *   }
 * }
 */
export function resources<T>(baseUrl: string, internal = false) {
  return {
    GET: {
      /**
       * Mengambil semua data dari resource
       * @param revalidate - Waktu cache dalam detik (optional)
       */
      all: (revalidate?: number) =>
        fetcher<T[]>(baseUrl, { revalidate, internal }),
      
      /**
       * Mengambil data berdasarkan ID
       * @param id - ID dari resource yang dicari
       * @param revalidate - Waktu cache dalam detik (optional)
       */
      byId: (id: string | number, revalidate?: number) =>
        fetcher<T>(`${baseUrl}/${id}`, { revalidate, internal }),
    },
    POST: {
      /**
       * Membuat data baru
       * @param data - Data yang akan dibuat (partial object)
       */
      create: (data: Partial<T>) =>
        fetcher<T>(baseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          internal,
        }),
    },
    PUT: {
      /**
       * Mengupdate data berdasarkan ID
       * @param id - ID dari resource yang akan diupdate
       * @param data - Data yang akan diupdate (partial object)
       */
      update: (id: string | number, data: Partial<T>) =>
        fetcher<T>(`${baseUrl}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          internal,
        }),
    },
    DELETE: {
      /**
       * Menghapus data berdasarkan ID
       * @param id - ID dari resource yang akan dihapus
       */
      remove: (id: string | number) =>
        fetcher<{ success: boolean }>(`${baseUrl}/${id}`, {
          method: "DELETE",
          internal,
        }),
    },
  }
}

