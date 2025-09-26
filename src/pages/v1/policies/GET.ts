import { NextResponse } from "next/server"
import { policiesService } from "@/services/database/policies/policies.service"
import { createCorsResponse } from "@/utils/cors"

/**
 * GET /api/v1/policies - Mengambil semua policies
 * @returns Promise<NextResponse> - Response dengan daftar policies atau error
 */
export async function GET() {
  try {
    const policies = await policiesService.GET.All()
    return createCorsResponse(policies)
  } catch (error) {
    console.error('Error fetching policies:', error)
    return createCorsResponse(
      { error: 'Failed to fetch policies' },
      { status: 500 }
    )
  }
}