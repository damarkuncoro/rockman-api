import { NextRequest, NextResponse } from "next/server"
import { policyViolationsService } from "@/services/database/policy_violations/policy_violations.service"

/**
 * DELETE /api/v1/policy_violations - Menghapus policy violation
 * @param req - NextRequest object dengan ID policy violation yang akan dihapus
 * @returns Promise<NextResponse> - Response dengan konfirmasi penghapusan atau error
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    await policyViolationsService.DELETE.Remove(parseInt(id))
    return NextResponse.json({ message: 'Policy violation deleted successfully' })
  } catch (error) {
    console.error('Error deleting policy violation:', error)
    return NextResponse.json(
      { error: 'Failed to delete policy violation' },
      { status: 500 }
    )
  }
}