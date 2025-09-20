import { useCallback } from 'react'
import { API } from '@/services/frontend/api/users'
import type { User } from '@/db/schema/users'

/**
 * Hook untuk mengambil semua users dari API
 * 
 * Domain: User Management - GET Operations
 * Responsibility: Mengelola operasi fetch semua users
 */
export const useFetchUsers = () => {
  /**
   * Fetch semua users dari API menggunakan API.users.GET.all()
   * @param setUsers - Setter untuk state users
   * @param setLoading - Setter untuk state loading
   * @param showMessage - Function untuk menampilkan pesan
   */
  const fetchUsers = useCallback(async (
    setUsers: (users: User[]) => void,
    setLoading: (loading: boolean) => void,
    showMessage: (message: string, type: 'success' | 'error' | 'info') => void
  ) => {
    setLoading(true)
    try {
      const data = await API.users.GET.all()
      setUsers(data)
      showMessage(`Berhasil mengambil ${data.length} users`, 'success')
    } catch (error) {
      showMessage(`Error fetching users: ${error}`, 'error')
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  return { fetchUsers }
}