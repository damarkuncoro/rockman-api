import { NextRequest, NextResponse } from "next/server"
import { departmentsService } from "@/services/database/departments/departments.service"
import { createCorsResponse } from "@/utils/cors"

/**
 * GET /api/v1/departments/[id] - Mengambil department berdasarkan ID
 * 
 * @param req - NextRequest object
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan department atau error
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    
    // Validasi format ID
    if (isNaN(id) || id <= 0) {
      return createCorsResponse(
        { error: 'Invalid ID format. ID must be a positive integer.' },
        { status: 400 }
      )
    }

    // Ambil department berdasarkan ID
    const department = await departmentsService.findById(id)
    
    if (!department) {
      return createCorsResponse(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    return createCorsResponse(department)
    
  } catch (error) {
    console.error('Error fetching department:', error)
    return createCorsResponse(
      { error: 'Failed to fetch department' },
      { status: 500 }
    )
  }
}