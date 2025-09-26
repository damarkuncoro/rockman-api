import { NextRequest, NextResponse } from "next/server"
import { rolesService } from "@/services/database/roles/roles.service"
import { addCorsHeaders } from "@/utils/cors"

/**
 * POST /api/v1/roles - Membuat role baru
 * @param req - NextRequest object dengan data role
 * @returns Promise<NextResponse> - Response dengan role yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Validasi input dasar
    if (!data.name || typeof data.name !== 'string') {
      const errorResponse = NextResponse.json(
        { error: 'Name is required and must be a string' },
        { status: 400 }
      )
      return addCorsHeaders(errorResponse)
    }

    const role = await rolesService.POST.Create(data)
    const response = NextResponse.json(role, { status: 201 })
    return addCorsHeaders(response)
  } catch (error: any) {
    console.error('Error creating role:', error)
    
    // Handle database constraint violations - check both direct error and nested cause
    const dbError = error.cause || error
    if (dbError.code === '23505' || error.code === '23505') {
      let roleName = 'unknown'
      
      // Try to extract role name from error detail
      const detail = dbError.detail || error.detail
      if (detail) {
        const match = detail.match(/Key \(name\)=\(([^)]+)\)/)
        if (match) {
          roleName = match[1]
        }
      }
      
      const errorResponse = NextResponse.json(
        { error: `Role with name '${roleName}' already exists` },
        { status: 409 }
      )
      return addCorsHeaders(errorResponse)
    }
    
    // Handle other errors
    const errorResponse = NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    )
    return addCorsHeaders(errorResponse)
  }
}