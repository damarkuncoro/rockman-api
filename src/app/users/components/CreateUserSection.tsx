import { CreateUserForm, User } from '../hooks/useUsers'

interface CreateUserSectionProps {
  createForm: CreateUserForm
  onCreateFormChange: (field: keyof CreateUserForm, value: string) => void
  onCreateUser: (userData: Partial<User>) => Promise<User>
  loading: boolean
}

/**
 * Component untuk section POST - Create User
 * Mengimplementasikan Single Responsibility Principle
 */
export const CreateUserSection = ({ 
  createForm, 
  onCreateFormChange, 
  onCreateUser, 
  loading 
}: CreateUserSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-xl font-semibold mb-4 text-purple-600">POST - Create User</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={createForm.name}
          onChange={(e) => onCreateFormChange('name', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={createForm.email}
          onChange={(e) => onCreateFormChange('email', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={createForm.password}
          onChange={(e) => onCreateFormChange('password', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={() => onCreateUser(createForm)}
          disabled={loading || !createForm.name || !createForm.email || !createForm.password}
          className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Create User
        </button>
      </div>
    </div>
  )
}