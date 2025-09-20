interface GetAllUsersSectionProps {
  onFetchUsers: () => void
  loading: boolean
}

/**
 * Component untuk section GET All Users
 * Mengimplementasikan Single Responsibility Principle
 */
export const GetAllUsersSection = ({ onFetchUsers, loading }: GetAllUsersSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-xl font-semibold mb-4 text-green-600">GET - Fetch All Users</h2>
      <button
        onClick={onFetchUsers}
        disabled={loading}
        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        Refresh Users List
      </button>
    </div>
  )
}