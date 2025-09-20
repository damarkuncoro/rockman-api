import { NextResponse } from "next/server"
import { changeHistoryService } from "@/services/database/change_history/change_history.service"

/**
 * GET /api/v1/change_history - Mengambil semua change history
 * @returns Promise<NextResponse> - Response dengan array change history atau error
 */
export async function GET() {
  try {
    const changeHistory = await changeHistoryService.GET.All()
    return NextResponse.json(changeHistory)
  } catch (error) {
    console.error('Error fetching change history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch change history' },
      { status: 500 }
    )
  }
}