import { NextRequest, NextResponse } from "next/server"
import { policyViolationsService } from "@/services/database/policy_violations/policy_violations.service"

/**
 * POST /api/v1/policy_violations - Membuat policy violation baru
 * @param req - NextRequest object dengan data policy violation
 * @returns Promise<NextResponse> - Response dengan policy violation yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const policyViolation = await policyViolationsService.POST.Create(data)
    return NextResponse.json(policyViolation, { status: 201 })
  } catch (error) {
    console.error('Error creating policy violation:', error)
    return NextResponse.json(
      { error: 'Failed to create policy violation' },
      { status: 500 }
    )
  }
}