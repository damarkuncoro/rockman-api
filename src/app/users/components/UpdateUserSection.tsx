import { UpdateUserForm, User } from '../hooks/useUsers'

interface UpdateUserSectionProps {
  updateForm: UpdateUserForm & { id: string }
  onUpdateFormChange: (field: keyof (UpdateUserForm & { id: string }), value: string) => void
  onUpdateUser: (id: number, userData: Partial<User>) => Promise<User>
  loading: boolean
}

/**
 * Component untuk section PUT - Update User
 * Mengimplementasikan Single Responsibility Principle
 */
export const UpdateUserSection = ({ 
  updateForm, 
  onUpdateFormChange, 
  onUpdateUser, 
  loading 
}: UpdateUserSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-xl font-semibold mb-4 text-orange-600">PUT - Update User</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="User ID"
          value={updateForm.id}
          onChange={(e) => onUpdateFormChange('id', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Name"
          value={updateForm.name || ''}
          onChange={(e) => onUpdateFormChange('name', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={updateForm.email || ''}
          onChange={(e) => onUpdateFormChange('email', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Department (optional)"
          value={updateForm.department || ''}
          onChange={(e) => onUpdateFormChange('department', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Region (optional)"
          value={updateForm.region || ''}
          onChange={(e) => onUpdateFormChange('region', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Level (optional)"
          value={updateForm.level || ''}
          onChange={(e) => onUpdateFormChange('level', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={() => {
            const { id, ...userData } = updateForm;
            onUpdateUser(parseInt(id), userData);
          }}
          disabled={loading || !updateForm.id}
          className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          Update User
        </button>
      </div>
    </div>
  )
}