import { NextRequest, NextResponse } from "next/server"
import { policyViolationsService } from "@/services/database/policy_violations/policy_violations.service"

/**
 * PUT /api/v1/policy_violations/[id] - Update policy violation berdasarkan ID
 * @param req - NextRequest object dengan data update
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan policy violation yang diupdate atau error
 */
export async function PUT(
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

    const data = await req.json()
    const policyViolation = await policyViolationsService.PUT.Update(id, data)
    
    return NextResponse.json(policyViolation)
  } catch (error) {
    console.error('Error updating policy violation:', error)
    return NextResponse.json(
      { error: 'Failed to update policy violation' },
      { status: 500 }
    )
  }
}