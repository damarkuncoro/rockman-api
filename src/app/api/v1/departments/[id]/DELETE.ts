import { NextRequest, NextResponse } from "next/server"
import { departmentsService } from "@/services/database/departments/departments.service"
import { createCorsResponse } from "@/utils/cors"

/**
 * DELETE /api/v1/departments/[id] - Soft delete department berdasarkan ID
 * 
 * @param req - NextRequest object
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan konfirmasi penghapusan atau error
 */
export async function DELETE(
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

    // Soft delete department menggunakan service
    const deletedDepartment = await departmentsService.softDeleteDepartment(id)
    
    return createCorsResponse({
      message: 'Department deleted successfully',
      data: deletedDepartment
    })
    
  } catch (error: any) {
    console.error('Error deleting department:', error)
    
    // Handle specific business logic errors
    if (error.message.includes('not found')) {
      return createCorsResponse(
        { error: error.message },
        { status: 404 }
      )
    }
    
    return createCorsResponse(
      { error: 'Failed to delete department' },
      { status: 500 }
    )
  }
}