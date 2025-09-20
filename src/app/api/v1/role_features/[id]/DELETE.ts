import { NextRequest, NextResponse } from "next/server"
import { roleFeaturesService } from "@/services/database/role_features/role_features.service"

/**
 * DELETE /api/v1/role_features/[id] - Menghapus role feature berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object berisi parameter ID
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

    await roleFeaturesService.DELETE.Remove(id)
    return NextResponse.json({ message: 'Role feature deleted successfully' })
  } catch (error) {
    console.error('Error deleting role feature:', error)
    return NextResponse.json(
      { error: 'Failed to delete role feature' },
      { status: 500 }
    )
  }
}