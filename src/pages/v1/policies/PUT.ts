import { NextRequest, NextResponse } from "next/server"
import { policiesService } from "@/services/database/policies/policies.service"

/**
 * PUT /api/v1/policies - Update policy
 * @param req - NextRequest object dengan data policy yang akan diupdate
 * @returns Promise<NextResponse> - Response dengan policy yang diupdate atau error
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

    const policy = await policiesService.PUT.Update(data.id, data)
    return NextResponse.json(policy)
  } catch (error) {
    console.error('Error updating policy:', error)
    return NextResponse.json(
      { error: 'Failed to update policy' },
      { status: 500 }
    )
  }
}