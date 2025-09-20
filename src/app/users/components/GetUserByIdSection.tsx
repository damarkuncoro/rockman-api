interface GetUserByIdSectionProps {
  userId: string
  onUserIdChange: (id: string) => void
  onFetchUserById: (id: number) => Promise<void>
  loading: boolean
}

/**
 * Component untuk section GET User by ID
 * Mengimplementasikan Single Responsibility Principle
 */
export const GetUserByIdSection = ({ 
  userId, 
  onUserIdChange, 
  onFetchUserById, 
  loading 
}: GetUserByIdSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">GET - Fetch User by ID</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={() => onFetchUserById(parseInt(userId))}
          disabled={loading || !userId}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Fetch User by ID
        </button>
      </div>
    </div>
  )
}