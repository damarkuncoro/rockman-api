import { NextRequest, NextResponse } from "next/server"
import { usersService } from "@/services/database/users/users.service"
import { processPasswordInData, hasValidPassword } from "@/utils/password.utils"

/**
 * POST /api/v1/password/reset - Reset password user berdasarkan email
 * @param request - NextRequest object berisi email user
 * @returns Promise<NextResponse> - Response dengan status reset atau error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validasi input
    if (!email) {
      return NextResponse.json(
        { error: 'Email wajib diisi' },
        { status: 400 }
      )
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    // Cari user berdasarkan email
    const user = await usersService.findByEmail(email)
    if (!user) {
      // Untuk keamanan, tidak memberitahu bahwa email tidak ditemukan
      return NextResponse.json(
        { message: 'Jika email terdaftar, instruksi reset password akan dikirim' },
        { status: 200 }
      )
    }

    // Generate password baru (8 karakter random)
    const newPassword = generateRandomPassword(8)
    
    // Validasi password baru menggunakan utility
    if (!hasValidPassword({ password: newPassword })) {
      return NextResponse.json(
        { error: 'Gagal generate password baru yang valid' },
        { status: 500 }
      )
    }

    // Process password baru menggunakan utility
    const processedData = await processPasswordInData({ password: newPassword })
    
    // Update password di database
    await usersService.PUT.Update(user.id, { 
      passwordHash: processedData.password 
    })

    // TODO: Implementasi pengiriman email dengan password baru
    // Untuk saat ini, return password baru (dalam production, kirim via email)
    return NextResponse.json({
      message: 'Password berhasil direset',
      // PERINGATAN: Dalam production, jangan return password dalam response
      // Kirim via email yang aman
      temporaryPassword: newPassword,
      note: 'Silakan ganti password ini setelah login'
    })

  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Gagal reset password' },
      { status: 500 }
    )
  }
}

/**
 * Generate password random dengan kombinasi huruf, angka, dan simbol
 * @param length - Panjang password yang diinginkan
 * @returns string - Password random
 */
function generateRandomPassword(length: number): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*'
  
  const allChars = lowercase + uppercase + numbers + symbols
  let password = ''
  
  // Pastikan minimal ada 1 dari setiap kategori
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Isi sisa karakter secara random
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Shuffle password untuk randomize posisi
  return password.split('').sort(() => Math.random() - 0.5).join('')
}