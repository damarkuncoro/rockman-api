import { MessageState } from '../hooks/useUsers'

interface MessageDisplayProps {
  messageState: MessageState | null
}

/**
 * Component untuk menampilkan pesan feedback kepada user
 * Mengimplementasikan Single Responsibility Principle
 */
export const MessageDisplay = ({ messageState }: MessageDisplayProps) => {
  if (!messageState || !messageState.message) return null

  const { message, type } = messageState

  const getMessageStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border border-green-300'
      case 'error':
        return 'bg-red-100 text-red-800 border border-red-300'
      default:
        return 'bg-blue-100 text-blue-800 border border-blue-300'
    }
  }

  return (
    <div className={`mb-6 p-4 rounded-lg ${getMessageStyles()}`}>
      {message}
    </div>
  )
}