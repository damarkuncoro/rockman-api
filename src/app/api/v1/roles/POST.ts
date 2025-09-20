import { NextRequest, NextResponse } from "next/server"
import { rolesService } from "@/services/database/roles/roles.service"

/**
 * POST /api/v1/roles - Membuat role baru
 * @param req - NextRequest object dengan data role
 * @returns Promise<NextResponse> - Response dengan role yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const role = await rolesService.POST.Create(data)
    return NextResponse.json(role, { status: 201 })
  } catch (error) {
    console.error('Error creating role:', error)
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    )
  }
}