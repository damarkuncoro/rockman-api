import { NextResponse } from "next/server"
import { sessionsService } from "@/services/database/sessions/sessions.service"

/**
 * GET /api/v1/sessions - Mengambil semua sessions
 * @returns Promise<NextResponse> - Response dengan daftar sessions atau error
 */
export async function GET() {
  try {
    const sessions = await sessionsService.GET.All()
    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}