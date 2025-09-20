import { NextRequest, NextResponse } from "next/server"
import { usersService } from "@/services/database/users/users.service"
import { processPasswordInData } from "@/utils/password.utils"

/**
 * POST /api/v1/users - Membuat user baru
 * @param req - NextRequest object dengan data user baru
 * @returns Promise<NextResponse> - Response dengan user yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json()
    
    // Proses password menggunakan utility function
    const processedData = await processPasswordInData(rawData)
    
    const user = await usersService.POST.Create(processedData)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}