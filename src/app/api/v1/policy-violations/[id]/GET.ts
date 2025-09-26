import { NextRequest, NextResponse } from "next/server"
import { policyViolationsService } from "@/services/database/policy_violations/policy_violations.service"

/**
 * GET /api/v1/policy_violations/[id] - Mengambil policy violation berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan policy violation atau error
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const policyViolation = await policyViolationsService.GET.ById(id)
    
    if (!policyViolation) {
      return NextResponse.json(
        { error: 'Policy violation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(policyViolation)
  } catch (error) {
    console.error('Error fetching policy violation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch policy violation' },
      { status: 500 }
    )
  }
}