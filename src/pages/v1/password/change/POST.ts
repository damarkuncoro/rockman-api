import { NextRequest, NextResponse } from "next/server"
import { usersPasswordService, ChangePasswordRequest } from "@/services/database/users/password.service"

/**
 * POST /api/v1/password/change - Ganti password user
 * 
 * Domain: Authentication & Security
 * Responsibility: Mengganti password user dengan validasi password lama
 * 
 * @param req - NextRequest object dengan data change password
 * @returns Promise<NextResponse> - Response sukses atau error
 */
export async function POST(req: NextRequest) {
  try {
    const requestData: ChangePasswordRequest = await req.json()

    // Validasi input menggunakan service
    const result = await usersPasswordService.changePassword(requestData)

    if (!result.isValid) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: result.message },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Gagal mengubah password' },
      { status: 500 }
    )
  }
}