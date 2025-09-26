import { NextRequest, NextResponse } from "next/server"
import { sessionsService } from "@/services/database/sessions/sessions.service"

/**
 * DELETE /api/v1/sessions - Menghapus session
 * @param req - NextRequest object dengan ID session yang akan dihapus
 * @returns Promise<NextResponse> - Response dengan konfirmasi penghapusan atau error
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    await sessionsService.DELETE.Remove(parseInt(id))
    return NextResponse.json({ message: 'Session deleted successfully' })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    )
  }
}