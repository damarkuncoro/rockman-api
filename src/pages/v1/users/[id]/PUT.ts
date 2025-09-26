import { NextRequest, NextResponse } from "next/server"
import { SERVICE } from "@/core/core.service.registry"
import { processPasswordInData, hasValidPassword, sanitizePasswordFromData } from "@/utils/password.utils"

/**
 * PUT /api/v1/users/[id] - Update user berdasarkan ID
 * @param request - Next.js request object dengan data update
 * @param params - Route parameters containing the user ID
 */
export async function PUT(
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

    const rawData = await request.json()
    
    // Process password jika ada dalam data update
    let processedData = rawData
    if (hasValidPassword(rawData)) {
      // Hash password baru menggunakan utility
      processedData = await processPasswordInData(rawData)
    }
    
    // Hapus password plain text dari data yang akan disimpan
    const sanitizedData = sanitizePasswordFromData(processedData)
    
    // Update user melalui SERVICE.users.PUT
    const updatedUser = await (SERVICE as any).users.PUT.ID(userId, sanitizedData)
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: `User with ID ${userId} not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
