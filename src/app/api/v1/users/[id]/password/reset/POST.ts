

import { NextRequest, NextResponse } from "next/server"
import { SERVICE } from "@/core/core.service.registry"

/**
 * Interface untuk reset password request
 */
interface ResetPasswordRequest {
  userId: number
  resetToken: string
  newPassword: string
}

/**
 * POST /api/v1/users/[id]/password/reset - Reset password user
 * 
 * Domain: Authentication & Security
 * Responsibility: Reset password user dengan token reset
 * 
 * @param req - NextRequest object dengan data reset password
 * @param context - Context dengan (await params).id untuk user ID
 * @returns Promise<NextResponse> - Response sukses atau error
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const requestData = await req.json()
    const userId = parseInt((await params).id)

    // Validasi user ID
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'User ID tidak valid' },
        { status: 400 }
      )
    }

    // Prepare request dengan user ID
    const resetPasswordRequest: ResetPasswordRequest = {
      userId,
      resetToken: requestData.resetToken,
      newPassword: requestData.newPassword
    }
    
    // Reset password menggunakan SERVICE.password
    const result = await (SERVICE as any).password.POST.reset(resetPasswordRequest)

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
    console.error('Error in password reset:', error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}