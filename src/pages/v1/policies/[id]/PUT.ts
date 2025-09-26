import { NextRequest, NextResponse } from "next/server"
import { policiesService } from "@/services/database/policies/policies.service"

/**
 * PUT /api/v1/policies/[id] - Update policy berdasarkan ID
 * @param req - NextRequest object dengan data update
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan policy yang diupdate atau error
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
    const policy = await policiesService.PUT.Update(id, data)
    
    return NextResponse.json(policy)
  } catch (error) {
    console.error('Error updating policy:', error)
    return NextResponse.json(
      { error: 'Failed to update policy' },
      { status: 500 }
    )
  }
}