import { NextRequest, NextResponse } from "next/server"
import { rolesService } from "@/services/database/roles/roles.service"
import { addCorsHeaders } from "@/utils/cors"

/**
 * DELETE /api/v1/roles - Menghapus role
 * @param req - NextRequest object dengan ID role yang akan dihapus
 * @returns Promise<NextResponse> - Response dengan konfirmasi penghapusan atau error
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      const errorResponse = NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
      return addCorsHeaders(errorResponse)
    }

    await rolesService.DELETE.Remove(parseInt(id))
    const response = NextResponse.json({ message: 'Role deleted successfully' })
    return addCorsHeaders(response)
  } catch (error) {
    console.error('Error deleting role:', error)
    const errorResponse = NextResponse.json(
      { error: 'Failed to delete role' },
      { status: 500 }
    )
    return addCorsHeaders(errorResponse)
  }
}