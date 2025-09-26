import { NextRequest, NextResponse } from "next/server"
import { userRolesService } from "@/services/database/user_roles/user_roles.service"

/**
 * POST /api/v1/user_roles - Membuat user role baru
 * @param req - NextRequest object dengan data user role baru
 * @returns Promise<NextResponse> - Response dengan user role yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const userRole = await userRolesService.POST.Create(data)
    return NextResponse.json(userRole, { status: 201 })
  } catch (error) {
    console.error('Error creating user role:', error)
    return NextResponse.json(
      { error: 'Failed to create user role' },
      { status: 500 }
    )
  }
}