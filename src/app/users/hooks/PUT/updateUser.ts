import { useCallback } from 'react'
import { API } from '@/services/frontend/api/users'
import type { User } from '@/db/schema/users'

/**
 * Hook untuk mengupdate user via API
 * 
 * Domain: User Management - PUT Operations
 * Responsibility: Mengelola operasi update user
 */
export const useUpdateUser = () => {
  /**
   * Mengupdate user menggunakan API.users.PUT.update()
   * @param id - ID user yang akan diupdate
   * @param userData - Data user yang akan diupdate
   * @param setUsers - Setter untuk state users
   * @param setLoading - Setter untuk state loading
   * @param showMessage - Function untuk menampilkan pesan
   * @param resetUpdateForm - Function untuk reset form update
   */
  const updateUser = useCallback(async (
    id: number,
    userData: Partial<User>,
    setUsers: (updater: (prev: User[]) => User[]) => void,
    setLoading: (loading: boolean) => void,
    showMessage: (message: string, type: 'success' | 'error' | 'info') => void,
    resetUpdateForm: () => void
  ) => {
    setLoading(true)
    try {
      const updatedUser = await API.users.PUT.update(id, userData)
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user))
      resetUpdateForm()
      showMessage('User berhasil diupdate', 'success')
      return updatedUser
    } catch (error) {
      console.error('Error updating user:', error)
      showMessage('Gagal mengupdate user', 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateUser }
}