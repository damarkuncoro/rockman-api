'use client'

import { useUsers } from './hooks/useUsers'
import {
  MessageDisplay,
  LoadingIndicator,
  GetAllUsersSection,
  GetUserByIdSection,
  CreateUserSection,
  UpdateUserSection,
  DeleteUserSection,
  UsersTable
} from './components'

/**
 * Users Test Page - Refactored dengan separation of concerns
 * Mengimplementasikan Single Responsibility Principle
 * UI components terpisah dari business logic (hooks)
 */
export default function UsersTestPage() {
  const {
    users,
    selectedUser,
    loading,
    message,
    createForm,
    updateForm,
    userId,
    deleteUserId,
    
    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    
    // Form handlers
    handleCreateFormChange,
    handleUpdateFormChange,
    handleSelectUserForUpdate,
    
    // Setters
    setSelectedUser,
    setUserId,
    setDeleteUserId,
    
    // Utils
    showMessage,
    resetCreateForm,
    resetUpdateForm
  } = useUsers()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Users API Test Page</h1>
        <p className="text-gray-600">Test semua endpoint API untuk Users service</p>
      </div>

      {/* Message Display */}
      <MessageDisplay messageState={message} />

      {/* Loading Indicator */}
      <LoadingIndicator loading={loading} />

      {/* API Test Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GET All Users */}
        <GetAllUsersSection 
          onFetchUsers={fetchUsers}
          loading={loading}
        />

        {/* GET User by ID */}
        <GetUserByIdSection
          userId={userId}
          onUserIdChange={setUserId}
          onFetchUserById={fetchUserById}
          loading={loading}
        />

        {/* POST Create User */}
        <CreateUserSection
          createForm={createForm}
          onCreateFormChange={handleCreateFormChange}
          onCreateUser={createUser}
          loading={loading}
        />

        {/* PUT Update User */}
        <UpdateUserSection
          updateForm={updateForm}
          onUpdateFormChange={handleUpdateFormChange}
          onUpdateUser={updateUser}
          loading={loading}
        />

        {/* DELETE User */}
        <DeleteUserSection
          deleteUserId={deleteUserId}
          onDeleteUserIdChange={setDeleteUserId}
          onDeleteUser={deleteUser}
          loading={loading}
        />
      </div>

      {/* Users Table */}
      <UsersTable users={users} />

      {/* Selected User Detail */}
      {selectedUser && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Selected User Detail</h2>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(selectedUser, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}