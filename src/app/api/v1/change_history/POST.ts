import { NextRequest, NextResponse } from "next/server"
import { changeHistoryService } from "@/services/database/change_history/change_history.service"

/**
 * POST /api/v1/change_history - Membuat change history baru
 * @param req - NextRequest object dengan data change history baru
 * @returns Promise<NextResponse> - Response dengan change history yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const changeHistory = await changeHistoryService.POST.Create(data)
    return NextResponse.json(changeHistory, { status: 201 })
  } catch (error) {
    console.error('Error creating change history:', error)
    return NextResponse.json(
      { error: 'Failed to create change history' },
      { status: 500 }
    )
  }
}