import { NextRequest, NextResponse } from "next/server"
import { routeFeaturesService } from "@/services/database/route_features/route_features.service"

/**
 * DELETE /api/v1/route_features - Menghapus route feature
 * @param req - NextRequest object dengan ID route feature yang akan dihapus
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

    await routeFeaturesService.DELETE.Remove(parseInt(id))
    return NextResponse.json({ message: 'Route feature deleted successfully' })
  } catch (error) {
    console.error('Error deleting route feature:', error)
    return NextResponse.json(
      { error: 'Failed to delete route feature' },
      { status: 500 }
    )
  }
}