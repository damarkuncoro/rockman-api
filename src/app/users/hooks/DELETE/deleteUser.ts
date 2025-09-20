import { useCallback } from 'react'
import { API } from '@/services/frontend/api/users'
import type { User } from '@/db/schema/users'

/**
 * Hook untuk menghapus user via API
 * 
 * Domain: User Management - DELETE Operations
 * Responsibility: Mengelola operasi delete user
 */
export const useDeleteUser = () => {
  /**
   * Menghapus user menggunakan API.users.DELETE.remove()
   * @param id - ID user yang akan dihapus
   * @param setUsers - Setter untuk state users
   * @param setLoading - Setter untuk state loading
   * @param showMessage - Function untuk menampilkan pesan
   */
  const deleteUser = useCallback(async (
    id: number,
    setUsers: (updater: (prev: User[]) => User[]) => void,
    setLoading: (loading: boolean) => void,
    showMessage: (message: string, type: 'success' | 'error' | 'info') => void
  ) => {
    setLoading(true)
    try {
      await API.users.DELETE.remove(id)
      setUsers(prev => prev.filter(user => user.id !== id))
      showMessage('User berhasil dihapus', 'success')
    } catch (error) {
      console.error('Error deleting user:', error)
      showMessage('Gagal menghapus user', 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteUser }
}