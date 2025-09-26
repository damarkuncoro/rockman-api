import { NextRequest, NextResponse } from "next/server"
import { SERVICE } from "@/core/core.service.registry"

/**
 * Interface untuk verify email request
 */
interface VerifyEmailRequest {
  userId: number
  verificationCode: string
}

/**
 * POST /api/v1/users/[id]/email/verify - Verifikasi email user
 * 
 * Domain: User Management & Verification
 * Responsibility: Memverifikasi email user dengan kode verifikasi
 * 
 * @param req - NextRequest object dengan data verify email
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
    const verifyEmailRequest: VerifyEmailRequest = {
      userId,
      verificationCode: requestData.verificationCode
    }

    const email = requestData.email

    // Validasi input dasar
    if (!email || !verifyEmailRequest.verificationCode) {
      return NextResponse.json(
        { error: 'Email dan kode verifikasi harus diisi' },
        { status: 400 }
      )
    }

    // Validasi format email menggunakan SERVICE.email
    const emailValidation = (SERVICE as any).email.POST.validate(email)
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.message },
        { status: 400 }
      )
    }

    // Verifikasi email menggunakan SERVICE.email
    const result = await (SERVICE as any).email.POST.verify(verifyEmailRequest)

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
    console.error('Error verifying email:', error)
    return NextResponse.json(
      { error: 'Gagal memverifikasi email' },
      { status: 500 }
    )
  }
}