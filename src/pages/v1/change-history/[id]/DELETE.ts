import { NextRequest, NextResponse } from "next/server"
import { changeHistoryService } from "@/services/database/change_history/change_history.service"

/**
 * DELETE /api/v1/change_history/[id] - Menghapus change history berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan konfirmasi penghapusan atau error
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    await changeHistoryService.DELETE.Remove(id)
    return NextResponse.json({ message: 'Change history deleted successfully' })
  } catch (error) {
    console.error('Error deleting change history:', error)
    return NextResponse.json(
      { error: 'Failed to delete change history' },
      { status: 500 }
    )
  }
}