import { NextRequest, NextResponse } from "next/server"
import { SERVICE } from "@/core/core.service.registry"

/**
 * Interface untuk change email request
 */
interface ChangeEmailRequest {
  userId: number
  currentPassword: string
  newEmail: string
}

/**
 * POST /api/v1/users/[id]/email/change - Ganti email user
 * 
 * Domain: User Management & Security
 * Responsibility: Mengganti email user dengan validasi password dan email format
 * 
 * @param req - NextRequest object dengan data change email
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
    const changeEmailRequest: ChangeEmailRequest = {
      userId,
      currentPassword: requestData.currentPassword,
      newEmail: requestData.newEmail
    }

    // Validasi input menggunakan SERVICE.email
    const result = await (SERVICE as any).email.POST.change(changeEmailRequest)

    if (!result.isValid) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        message: result.message,
        data: result.data 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error changing email:', error)
    return NextResponse.json(
      { error: 'Gagal mengubah email' },
      { status: 500 }
    )
  }
}