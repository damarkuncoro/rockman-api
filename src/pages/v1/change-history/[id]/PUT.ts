import { NextRequest, NextResponse } from "next/server"
import { changeHistoryService } from "@/services/database/change_history/change_history.service"

/**
 * PUT /api/v1/change_history/[id] - Update change history berdasarkan ID
 * @param req - NextRequest object dengan data update
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan change history yang diupdate atau error
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
    const changeHistory = await changeHistoryService.PUT.Update(id, data)
    
    return NextResponse.json(changeHistory)
  } catch (error) {
    console.error('Error updating change history:', error)
    return NextResponse.json(
      { error: 'Failed to update change history' },
      { status: 500 }
    )
  }
}