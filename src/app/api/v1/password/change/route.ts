import { NextRequest, NextResponse } from "next/server"
import { usersService } from "@/services/database/users/users.service"
import { processPasswordInData, hasValidPassword } from "@/utils/password.utils"
import { SYSTEM } from "@/services/systems"

/**
 * Interface untuk request change password
 */
interface ChangePasswordRequest {
  userId: number
  currentPassword: string
  newPassword: string
}

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
    const { userId, currentPassword, newPassword }: ChangePasswordRequest = await req.json()

    // Validasi input
    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'userId, currentPassword, dan newPassword wajib diisi' },
        { status: 400 }
      )
    }

    if (!hasValidPassword({ password: newPassword })) {
      return NextResponse.json(
        { error: 'Password baru tidak valid' },
        { status: 400 }
      )
    }

    // Ambil user dari database
    const user = await usersService.GET.ById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Verifikasi password lama
    const isOldPasswordValid = await SYSTEM.password.VERIFY(currentPassword, user.passwordHash)
    if (!isOldPasswordValid) {
      return NextResponse.json(
        { error: 'Password lama tidak valid' },
        { status: 400 }
      )
    }

    // Process password baru menggunakan utility
    const processedData = await processPasswordInData({ password: newPassword })
    
    // Update password di database
    await usersService.PUT.Update(userId, { 
      passwordHash: processedData.password 
    })

    return NextResponse.json(
      { message: 'Password berhasil diubah' },
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