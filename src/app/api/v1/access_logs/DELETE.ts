import { NextRequest, NextResponse } from "next/server"
import { accessLogsService } from "@/services/database/access_logs/access_logs.service"

/**
 * DELETE /api/v1/access_logs - Menghapus access log
 * @param req - NextRequest object dengan ID access log yang akan dihapus
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

    await accessLogsService.DELETE.Remove(parseInt(id))
    return NextResponse.json({ message: 'Access log deleted successfully' })
  } catch (error) {
    console.error('Error deleting access log:', error)
    return NextResponse.json(
      { error: 'Failed to delete access log' },
      { status: 500 }
    )
  }
}