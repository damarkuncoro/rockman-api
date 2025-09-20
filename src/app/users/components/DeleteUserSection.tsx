interface DeleteUserSectionProps {
  deleteUserId: string
  onDeleteUserIdChange: (id: string) => void
  onDeleteUser: (id: number) => Promise<void>
  loading: boolean
}

/**
 * Component untuk section DELETE - Delete User
 * Mengimplementasikan Single Responsibility Principle
 */
export const DeleteUserSection = ({ 
  deleteUserId, 
  onDeleteUserIdChange, 
  onDeleteUser, 
  loading 
}: DeleteUserSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-xl font-semibold mb-4 text-red-600">DELETE - Delete User</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="User ID to delete"
          value={deleteUserId}
          onChange={(e) => onDeleteUserIdChange(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={() => onDeleteUser(parseInt(deleteUserId))}
          disabled={loading || !deleteUserId}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Delete User
        </button>
      </div>
    </div>
  )
}