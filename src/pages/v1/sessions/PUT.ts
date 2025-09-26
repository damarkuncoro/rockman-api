import { NextRequest, NextResponse } from "next/server"
import { sessionsService } from "@/services/database/sessions/sessions.service"

/**
 * PUT /api/v1/sessions - Update session
 * @param req - NextRequest object dengan data session yang akan diupdate
 * @returns Promise<NextResponse> - Response dengan session yang diupdate atau error
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

    const session = await sessionsService.PUT.Update(data.id, data)
    return NextResponse.json(session)
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}