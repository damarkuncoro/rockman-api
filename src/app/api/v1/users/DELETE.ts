import { NextRequest, NextResponse } from "next/server"
import { usersService } from "@/services/database/users/users.service"

/**
 * DELETE /api/v1/users - Hapus user berdasarkan ID
 * @param req - NextRequest object dengan data yang berisi id user
 * @returns Promise<NextResponse> - Response konfirmasi penghapusan atau error
 */
export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json()
    await usersService.DELETE.Remove(data.id)
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}