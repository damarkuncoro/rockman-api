import { NextRequest, NextResponse } from "next/server"
import { usersService } from "@/services/database/users/users.service"

/**
 * DELETE /api/v1/users/[id] - Menghapus user berdasarkan ID
 * @param request - Next.js request object
 * @param params - Route parameters containing the user ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const userId = parseInt(resolvedParams.id)
    
    // Validasi ID - PostgreSQL integer range: -2147483648 to 2147483647
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { error: 'Invalid user ID. Must be a positive number.' },
        { status: 400 }
      )
    }

    // Validasi PostgreSQL integer overflow
    if (userId > 2147483647) {
      return NextResponse.json(
        { error: 'User ID is too large. Maximum value is 2147483647.' },
        { status: 400 }
      )
    }

    // Hapus user melalui service
    const deletedUser = await usersService.DELETE.Remove(userId)
    
    if (!deletedUser) {
      return NextResponse.json(
        { error: `User with ID ${userId} not found` },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      message: `User with ID ${userId} has been deleted successfully`,
      deletedUser 
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}