import { NextRequest, NextResponse } from "next/server"
import { sessionsService } from "@/services/database/sessions/sessions.service"

/**
 * DELETE /api/v1/sessions/[id] - Menghapus session berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object yang berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan konfirmasi penghapusan atau error
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    await sessionsService.DELETE.Remove(id)
    return NextResponse.json({ message: 'Session deleted successfully' })
  } catch (error) {
    console.error('Error deleting session by ID:', error)
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    )
  }
}