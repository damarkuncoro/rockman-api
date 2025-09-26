import { NextResponse } from "next/server"
import { rolesService } from "@/services/database/roles/roles.service"
import { addCorsHeaders } from "@/utils/cors"

/**
 * GET /api/v1/roles - Mengambil semua roles
 * @returns Promise<NextResponse> - Response dengan daftar roles atau error
 */
export async function GET() {
  try {
    const roles = await rolesService.GET.All()
    
    // Membuat response dengan CORS headers menggunakan utilitas
    const response = NextResponse.json(roles)
    return addCorsHeaders(response)
  } catch (error) {
    console.error('Error fetching roles:', error)
    
    // Membuat error response dengan CORS headers menggunakan utilitas
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    )
    return addCorsHeaders(errorResponse)
  }
}