import { NextRequest, NextResponse } from "next/server"
import { SERVICE } from "@/core/core.service.registry"

/**
 * Interface untuk change password request
 */
interface ChangePasswordRequest {
  userId: number
  currentPassword: string
  newPassword: string
}

/**
 * POST /api/v1/users/[id]/password/change - Ganti password user
 * 
 * Domain: Authentication & Security
 * Responsibility: Mengganti password user dengan validasi password lama
 * 
 * @param req - NextRequest object dengan data change password
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
    const changePasswordRequest: ChangePasswordRequest = {
      userId,
      currentPassword: requestData.currentPassword,
      newPassword: requestData.newPassword
    }

    // Validasi input menggunakan SERVICE.password.POST.changePassword
    const result = await (SERVICE as any).password.POST.change(changePasswordRequest)

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