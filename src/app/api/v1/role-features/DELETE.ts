import { NextRequest, NextResponse } from "next/server"
import { roleFeaturesService } from "@/services/database/role_features/role_features.service"

/**
 * DELETE /api/v1/role_features - Menghapus role feature
 * @param req - NextRequest object dengan ID role feature yang akan dihapus
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

    await roleFeaturesService.DELETE.Remove(parseInt(id))
    return NextResponse.json({ message: 'Role feature deleted successfully' })
  } catch (error) {
    console.error('Error deleting role feature:', error)
    return NextResponse.json(
      { error: 'Failed to delete role feature' },
      { status: 500 }
    )
  }
}