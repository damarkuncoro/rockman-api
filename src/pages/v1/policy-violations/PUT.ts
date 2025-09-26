import { NextRequest, NextResponse } from "next/server"
import { policyViolationsService } from "@/services/database/policy_violations/policy_violations.service"

/**
 * PUT /api/v1/policy_violations - Update policy violation
 * @param req - NextRequest object dengan data policy violation yang akan diupdate
 * @returns Promise<NextResponse> - Response dengan policy violation yang diupdate atau error
 */
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'ID is required for update' },
        { status: 400 }
      )
    }

    const policyViolation = await policyViolationsService.PUT.Update(data.id, data)
    return NextResponse.json(policyViolation)
  } catch (error) {
    console.error('Error updating policy violation:', error)
    return NextResponse.json(
      { error: 'Failed to update policy violation' },
      { status: 500 }
    )
  }
}