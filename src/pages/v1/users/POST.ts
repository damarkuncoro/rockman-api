import { NextRequest, NextResponse } from "next/server"
import { SERVICE } from "@/core/core.service.registry"
import { sanitizePasswordFromData } from "@/utils/password.utils"
import { addCorsHeaders } from "@/utils/cors"

/**
 * Interface untuk request body POST /api/v1/users
 */
interface CreateUserRequest {
  email: string
  password: string
  name?: string
  [key: string]: unknown
}

/**
 * POST /api/v1/users - Membuat user baru
 * 
 * Domain: User Management
 * Responsibility: Membuat user baru dengan validasi password yang proper
 * 
 * @param req - NextRequest object dengan data user baru
 * @returns Promise<NextResponse> - Response dengan user yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const rawData: CreateUserRequest = await req.json()
    
    // Validasi input dasar
    if (!rawData.email || !rawData.password) {
      return addCorsHeaders(NextResponse.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      ))
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(rawData.email)) {
      return addCorsHeaders(NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      ))
    }

    // Validasi kekuatan password menggunakan SERVICE.password.POST.strength
    const passwordValidation = (SERVICE as any).password.POST.strength(rawData.password)
    if (!passwordValidation.isValid) {
      return addCorsHeaders(NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      ))
    }

    // Hash password menggunakan SERVICE.password.POST.hash
    const hashedPassword = await (SERVICE as any).password.POST.hash(rawData.password)
    
    // Siapkan data user dengan password yang sudah di-hash
    const userData = {
      ...sanitizePasswordFromData(rawData),
      passwordHash: hashedPassword,
      email: rawData.email,
      name: rawData.name || rawData.email.split('@')[0] // Default name dari email jika tidak ada
    }
    
    // Buat user baru menggunakan SERVICE.users.POST.Create
    const user = await (SERVICE as any).users.POST.Create(userData)
    
    // Return user tanpa password hash
    const { passwordHash, ...userResponse } = user
    
    return addCorsHeaders(NextResponse.json(userResponse, { status: 201 }))
  } catch (error) {
    console.error('Error creating user:', error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return addCorsHeaders(NextResponse.json(
          { error: 'Email sudah terdaftar' },
          { status: 409 }
        ))
      }
    }
    
    return addCorsHeaders(NextResponse.json(
      { error: 'Gagal membuat user' },
      { status: 500 }
    ))
  }
}