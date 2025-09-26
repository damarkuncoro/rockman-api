import { NextRequest, NextResponse } from "next/server"
import { SERVICE } from "@/core/core.service.registry"
import { addCorsHeaders } from "@/utils/cors"

/**
 * PUT /api/v1/users - Update user yang sudah ada
 * @param req - NextRequest object dengan data update user (harus include id)
 * @returns Promise<NextResponse> - Response dengan user yang diupdate atau error
 */
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Validasi input dasar
    if (!data.id) {
      return addCorsHeaders(NextResponse.json(
        { error: 'ID user wajib diisi' },
        { status: 400 }
      ))
    }
    
    // Update user menggunakan SERVICE.users.PUT.Update
    const user = await (SERVICE as any).users.PUT.ID(data.id, data)
    return addCorsHeaders(NextResponse.json(user))
  } catch (error) {
    console.error('Error updating user:', error)
    return addCorsHeaders(NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    ))
  }
}