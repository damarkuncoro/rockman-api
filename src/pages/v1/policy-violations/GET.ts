import { NextResponse } from "next/server"
import { policyViolationsService } from "@/services/database/policy_violations/policy_violations.service"

/**
 * GET /api/v1/policy_violations - Mengambil semua policy violations
 * @returns Promise<NextResponse> - Response dengan daftar policy violations atau error
 */
export async function GET() {
  try {
    const policyViolations = await policyViolationsService.GET.All()
    return NextResponse.json(policyViolations)
  } catch (error) {
    console.error('Error fetching policy violations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch policy violations' },
      { status: 500 }
    )
  }
}