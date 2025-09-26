

import { NextRequest, NextResponse } from "next/server"
import { usersPasswordService, ResetPasswordRequest } from "@/services/database/users/password.service"

/**
 * POST /api/v1/password/reset
 * Endpoint untuk reset password user
 * 
 * @param request - NextRequest object
 * @returns NextResponse dengan status dan message
 */
export async function POST(request: NextRequest) {
  try {
    const requestData: ResetPasswordRequest = await request.json()
    
    // Reset password menggunakan service
    const result = await usersPasswordService.resetPassword(requestData)

    if (!result.isValid) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    // TODO: Kirim email dengan password baru ke user
    // Untuk saat ini, return success message
    return NextResponse.json(
      { message: result.message },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error in password reset:', error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}