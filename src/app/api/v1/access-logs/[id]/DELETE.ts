import { NextRequest, NextResponse } from "next/server"
import { accessLogsService } from "@/services/database/access_logs/access_logs.service"

/**
 * DELETE /api/v1/access_logs/[id] - Menghapus access log berdasarkan ID
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

    await accessLogsService.DELETE.Remove(id)
    return NextResponse.json({ message: 'Access log deleted successfully' })
  } catch (error) {
    console.error('Error deleting access log:', error)
    return NextResponse.json(
      { error: 'Failed to delete access log' },
      { status: 500 }
    )
  }
}