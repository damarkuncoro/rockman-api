import { NextRequest, NextResponse } from "next/server"
import { changeHistoryService } from "@/services/database/change_history/change_history.service"

/**
 * PUT /api/v1/change_history - Update change history
 * @param req - NextRequest object dengan data change history yang akan diupdate
 * @returns Promise<NextResponse> - Response dengan change history yang diupdate atau error
 */
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    const changeHistory = await changeHistoryService.PUT.Update(data.id, data)
    return NextResponse.json(changeHistory)
  } catch (error) {
    console.error('Error updating change history:', error)
    return NextResponse.json(
      { error: 'Failed to update change history' },
      { status: 500 }
    )
  }
}