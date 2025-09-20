import { useState, useEffect, useCallback, useMemo } from 'react'
import type { User } from '@/db/schema/users'

// Export tipe User untuk digunakan oleh komponen lain
export type { User }

// Import CRUD operations dari folder terpisah
import { useFetchUsers, useFetchUserById } from './GET'
import { useCreateUser } from './POST'
import { useUpdateUser } from './PUT'
import { useDeleteUser } from './DELETE'

/**
 * Interface untuk form data create user
 */
export interface CreateUserForm {
  name: string
  email: string
  password: string
  department?: string
  region?: string
  level?: number
}

/**
 * Interface untuk form data update user
 */
export interface UpdateUserForm {
  name?: string
  email?: string
  department?: string
  region?: string
  level?: number
}

/**
 * Interface untuk message state
 */
export interface MessageState {
  message: string
  type: 'success' | 'error' | 'info'
}

/**
 * Custom hook untuk mengelola state dan API calls untuk Users
 * Mengimplementasikan separation of concerns dengan memisahkan logic dari UI
 */
export const useUsers = () => {
  // State untuk data users
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<MessageState | null>(null)
  
  // State untuk ID operations
  const [userId, setUserId] = useState<string>('')
  const [deleteUserId, setDeleteUserId] = useState<string>('')
  
  // State untuk form
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    name: '',
    email: '',
    password: '',
    department: '',
    region: '',
    level: 1,
  })
  
  const [updateForm, setUpdateForm] = useState<UpdateUserForm>({
    name: '',
    email: '',
    department: '',
    region: '',
    level: 1,
  })

  // Import hooks dari folder terpisah
  const { fetchUsers } = useFetchUsers()
  const { fetchUserById } = useFetchUserById()
  const { createUser } = useCreateUser()
  const { updateUser } = useUpdateUser()
  const { deleteUser } = useDeleteUser()

  /**
   * Menampilkan pesan feedback kepada user
   * @param msg - Pesan yang akan ditampilkan
   * @param type - Tipe pesan (success, error, info)
   */
  const showMessage = useCallback((msg: string, type: 'success' | 'error' | 'info') => {
    setMessage({ message: msg, type })
    setTimeout(() => setMessage(null), 5000)
  }, [])

  /**
   * Reset form create user ke nilai default
   */
  const resetCreateForm = useCallback(() => {
    setCreateForm({
      name: '',
      email: '',
      password: '',
      department: '',
      region: '',
      level: 1,
    })
  }, [])

  /**
   * Reset form update user ke nilai default
   */
  const resetUpdateForm = useCallback(() => {
    setUpdateForm({
      name: '',
      email: '',
      department: '',
      region: '',
      level: 1,
    })
    setSelectedUser(null)
  }, [])

  // Wrapper functions untuk menggunakan hooks dengan state lokal
  const handleFetchUsers = useCallback(async () => {
    await fetchUsers(setUsers, setLoading, showMessage)
  }, [fetchUsers, showMessage])

  const handleFetchUserById = useCallback(async (id: number) => {
    await fetchUserById(id, setSelectedUser, setLoading, showMessage)
  }, [fetchUserById, showMessage])

  const handleCreateUser = useCallback(async (userData: Partial<User>) => {
    return await createUser(userData, setUsers, setLoading, showMessage, resetCreateForm)
  }, [createUser, showMessage, resetCreateForm])

  const handleUpdateUser = useCallback(async (id: number, userData: Partial<User>) => {
    return await updateUser(id, userData, setUsers, setLoading, showMessage, resetUpdateForm)
  }, [updateUser, showMessage, resetUpdateForm])

  const handleDeleteUser = useCallback(async (id: number) => {
    await deleteUser(id, setUsers, setLoading, showMessage)
  }, [deleteUser, showMessage])

  /**
   * Handler untuk mengubah form create user
   */
  const handleCreateFormChange = useCallback((field: keyof CreateUserForm, value: string | number) => {
    setCreateForm(prev => ({ ...prev, [field]: value }))
  }, [])

  // Computed property untuk updateForm dengan id
  const updateFormWithId = useMemo(() => {
    if (selectedUser) {
      return {
        ...updateForm,
        id: selectedUser.id.toString()
      }
    }
    return {
      ...updateForm,
      id: ''
    }
  }, [updateForm, selectedUser])

  /**
   * Handler untuk mengubah form update user (termasuk id)
   */
  const handleUpdateFormChangeWithId = useCallback((field: keyof (UpdateUserForm & { id: string }), value: string) => {
    if (field === 'id') {
      // Jika mengubah id, cari user berdasarkan id tersebut
      const userId = parseInt(value)
      const user = users.find(u => u.id === userId)
      if (user) {
        setSelectedUser(user)
        setUpdateForm({
          name: user.name,
          email: user.email,
          department: user.department || '',
          region: user.region || '',
          level: user.level || 1
        })
      }
    } else {
      setUpdateForm(prev => ({ ...prev, [field]: value }))
    }
  }, [users])

  /**
   * Handler untuk memilih user yang akan diupdate
   */
  const handleSelectUserForUpdate = useCallback((id: number) => {
    const user = users.find(u => u.id === id)
    if (user) {
      setSelectedUser(user)
      setUpdateForm({
        name: user.name,
        email: user.email,
        department: user.department || '',
        region: user.region || '',
        level: user.level || 1
      })
    }
  }, [users])

  // Load users saat hook pertama kali digunakan
  useEffect(() => {
    handleFetchUsers()
  }, [handleFetchUsers])

  return {
    // State
    users,
    selectedUser,
    loading,
    message,
    createForm,
    updateForm: updateFormWithId,
    userId,
    deleteUserId,
    
    // Actions
    fetchUsers: handleFetchUsers,
    fetchUserById: handleFetchUserById,
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
    
    // Form handlers
    handleCreateFormChange,
    handleUpdateFormChange: handleUpdateFormChangeWithId,
    handleSelectUserForUpdate,
    
    // Setters
    setSelectedUser,
    setUserId,
    setDeleteUserId,
    
    // Utils
    showMessage,
    resetCreateForm,
    resetUpdateForm
  }
}