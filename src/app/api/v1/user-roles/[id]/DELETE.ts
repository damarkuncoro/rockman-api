import { NextRequest, NextResponse } from "next/server"
import { userRolesService } from "@/services/database/user_roles/user_roles.service"

/**
 * DELETE /api/v1/user_roles/[id] - Menghapus user role berdasarkan ID
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

    await userRolesService.DELETE.Remove(id)
    return NextResponse.json({ message: 'User role deleted successfully' })
  } catch (error) {
    console.error('Error deleting user role:', error)
    return NextResponse.json(
      { error: 'Failed to delete user role' },
      { status: 500 }
    )
  }
}