import { NextRequest, NextResponse } from "next/server"
import { changeHistoryService } from "@/services/database/change_history/change_history.service"

/**
 * GET /api/v1/change_history/[id] - Mengambil change history berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan change history atau error
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const changeHistory = await changeHistoryService.GET.ById(id)
    
    if (!changeHistory) {
      return NextResponse.json(
        { error: 'Change history not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(changeHistory)
  } catch (error) {
    console.error('Error fetching change history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch change history' },
      { status: 500 }
    )
  }
}