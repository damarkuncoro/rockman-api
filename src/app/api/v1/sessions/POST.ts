import { NextRequest, NextResponse } from "next/server"
import { sessionsService } from "@/services/database/sessions/sessions.service"

/**
 * POST /api/v1/sessions - Membuat session baru
 * @param req - NextRequest object dengan data session
 * @returns Promise<NextResponse> - Response dengan session yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const session = await sessionsService.POST.Create(data)
    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}