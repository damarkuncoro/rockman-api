import { useCallback } from 'react'
import { API } from '@/services/frontend/api/users'
import type { User } from '@/db/schema/users'

/**
 * Hook untuk mengambil user berdasarkan ID dari API
 * 
 * Domain: User Management - GET Operations
 * Responsibility: Mengelola operasi fetch user by ID
 */
export const useFetchUserById = () => {
  /**
   * Mengambil user berdasarkan ID menggunakan API.users.GET.byId()
   * @param id - ID user yang akan diambil
   * @param setSelectedUser - Setter untuk state selected user
   * @param setLoading - Setter untuk state loading
   * @param showMessage - Function untuk menampilkan pesan
   */
  const fetchUserById = useCallback(async (
    id: number,
    setSelectedUser: (user: User | null) => void,
    setLoading: (loading: boolean) => void,
    showMessage: (message: string, type: 'success' | 'error' | 'info') => void
  ) => {
    setLoading(true)
    try {
      const user = await API.users.GET.byId(id)
      setSelectedUser(user)
      showMessage('User berhasil diambil', 'success')
    } catch (error) {
      console.error('Error fetching user:', error)
      showMessage('Gagal mengambil user', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  return { fetchUserById }
}