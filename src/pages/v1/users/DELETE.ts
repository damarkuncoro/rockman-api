import { NextRequest, NextResponse } from "next/server"
import { SERVICE } from "@/core/core.service.registry"
import { addCorsHeaders } from "@/utils/cors"

/**
 * DELETE /api/v1/users - Hapus user berdasarkan ID
 * @param req - NextRequest object dengan data yang berisi id user
 * @returns Promise<NextResponse> - Response konfirmasi penghapusan atau error
 */
export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Validasi input dasar
    if (!data.id) {
      return addCorsHeaders(NextResponse.json(
        { error: 'ID user wajib diisi' },
        { status: 400 }
      ))
    }
    
    // Hapus user menggunakan SERVICE.users.DELETE.Remove
    await (SERVICE as any).users.DELETE.ID(data.id)
    return addCorsHeaders(NextResponse.json({ message: 'User deleted successfully' }))
  } catch (error) {
    console.error('Error deleting user:', error)
    return addCorsHeaders(NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    ))
  }
}