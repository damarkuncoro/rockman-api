import { useCallback } from 'react'
import { API } from '@/services/frontend/api/users'
import type { User } from '@/db/schema/users'

/**
 * Hook untuk membuat user baru via API
 * 
 * Domain: User Management - POST Operations
 * Responsibility: Mengelola operasi create user baru
 */
export const useCreateUser = () => {
  /**
   * Membuat user baru menggunakan API.users.POST.create()
   * @param userData - Data user yang akan dibuat
   * @param setUsers - Setter untuk state users
   * @param setLoading - Setter untuk state loading
   * @param showMessage - Function untuk menampilkan pesan
   * @param resetCreateForm - Function untuk reset form create
   */
  const createUser = useCallback(async (
    userData: Partial<User>,
    setUsers: (updater: (prev: User[]) => User[]) => void,
    setLoading: (loading: boolean) => void,
    showMessage: (message: string, type: 'success' | 'error' | 'info') => void,
    resetCreateForm: () => void
  ) => {
    setLoading(true)
    try {
      const newUser = await API.users.POST.create(userData)
      setUsers(prev => [...prev, newUser])
      resetCreateForm()
      showMessage('User berhasil dibuat', 'success')
      return newUser
    } catch (error) {
      console.error('Error creating user:', error)
      showMessage('Gagal membuat user', 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { createUser }
}