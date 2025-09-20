import { NextRequest, NextResponse } from "next/server"
import { policiesService } from "@/services/database/policies/policies.service"

/**
 * POST /api/v1/policies - Membuat policy baru
 * @param req - NextRequest object dengan data policy
 * @returns Promise<NextResponse> - Response dengan policy yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const policy = await policiesService.POST.Create(data)
    return NextResponse.json(policy, { status: 201 })
  } catch (error) {
    console.error('Error creating policy:', error)
    return NextResponse.json(
      { error: 'Failed to create policy' },
      { status: 500 }
    )
  }
}