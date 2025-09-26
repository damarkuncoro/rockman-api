import { NextRequest, NextResponse } from "next/server"
import { changeHistoryService } from "@/services/database/change_history/change_history.service"

/**
 * DELETE /api/v1/change_history - Menghapus change history
 * @param req - NextRequest object dengan ID change history yang akan dihapus
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

    await changeHistoryService.DELETE.Remove(parseInt(id))
    return NextResponse.json({ message: 'Change history deleted successfully' })
  } catch (error) {
    console.error('Error deleting change history:', error)
    return NextResponse.json(
      { error: 'Failed to delete change history' },
      { status: 500 }
    )
  }
}