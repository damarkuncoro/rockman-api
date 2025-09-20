interface LoadingIndicatorProps {
  loading: boolean
}

/**
 * Component untuk menampilkan indikator loading
 * Mengimplementasikan Single Responsibility Principle
 */
export const LoadingIndicator = ({ loading }: LoadingIndicatorProps) => {
  if (!loading) return null

  return (
    <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg">
      Loading...
    </div>
  )
}