import { NextRequest, NextResponse } from "next/server"
import { usersService } from "@/services/database/users/users.service"

/**
 * PUT /api/v1/users - Update user yang sudah ada
 * @param req - NextRequest object dengan data update user (harus include id)
 * @returns Promise<NextResponse> - Response dengan user yang diupdate atau error
 */
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    const user = await usersService.PUT.Update(data.id, data)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}