import { NextRequest, NextResponse } from "next/server"
import { userRolesService } from "@/services/database/user_roles/user_roles.service"

/**
 * DELETE /api/v1/user_roles - Menghapus user role
 * @param req - NextRequest object dengan ID user role yang akan dihapus
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

    await userRolesService.DELETE.Remove(parseInt(id))
    return NextResponse.json({ message: 'User role deleted successfully' })
  } catch (error) {
    console.error('Error deleting user role:', error)
    return NextResponse.json(
      { error: 'Failed to delete user role' },
      { status: 500 }
    )
  }
}