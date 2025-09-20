import { NextRequest, NextResponse } from "next/server"
import { routeFeaturesService } from "@/services/database/route_features/route_features.service"

/**
 * DELETE /api/v1/route_features/[id] - Menghapus route feature berdasarkan ID
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

    await routeFeaturesService.DELETE.Remove(id)
    return NextResponse.json({ message: 'Route feature deleted successfully' })
  } catch (error) {
    console.error('Error deleting route feature by ID:', error)
    return NextResponse.json(
      { error: 'Failed to delete route feature' },
      { status: 500 }
    )
  }
}