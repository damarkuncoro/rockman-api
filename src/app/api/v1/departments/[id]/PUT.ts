import { NextRequest, NextResponse } from "next/server"
import { departmentsService } from "@/services/database/departments/departments.service"
import { updateDepartmentApiSchema } from "@/db/schema/departments"
import { createCorsResponse } from "@/utils/cors"

/**
 * PUT /api/v1/departments/[id] - Update department berdasarkan ID
 * 
 * @param req - NextRequest object dengan data update
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan department yang diupdate atau error
 */
export async function PUT(
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

    // Parse dan validasi request body
    const body = await req.json()
    const validationResult = updateDepartmentApiSchema.safeParse(body)
    
    if (!validationResult.success) {
      return createCorsResponse(
        { 
          error: 'Validation failed',
          details: validationResult.error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    // Update department menggunakan service
    const updatedDepartment = await departmentsService.updateDepartment(id, validationResult.data)
    
    return createCorsResponse(updatedDepartment)
    
  } catch (error: any) {
    console.error('Error updating department:', error)
    
    // Handle specific business logic errors
    if (error.message.includes('not found')) {
      return createCorsResponse(
        { error: error.message },
        { status: 404 }
      )
    }
    
    if (error.message.includes('already exists')) {
      return createCorsResponse(
        { error: error.message },
        { status: 409 }
      )
    }
    
    return createCorsResponse(
      { error: 'Failed to update department' },
      { status: 500 }
    )
  }
}