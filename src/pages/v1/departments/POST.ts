import { NextRequest, NextResponse } from "next/server"
import { departmentsService } from "@/services/database/departments/departments.service"
import { createCorsResponse } from "@/utils/cors"
import { createDepartmentSchema } from "@/db/schema/departments"

/**
 * POST /api/v1/departments - Membuat department baru
 * 
 * Request Body:
 * - name: string - Nama department (required)
 * - slug: string - Slug department (required, unique)
 * - code: string - Kode department (required, unique)
 * - description: string (optional) - Deskripsi department
 * - isActive: boolean (optional, default: true) - Status aktif department
 * 
 * @param req - NextRequest object dengan data department
 * @returns Promise<NextResponse> - Response dengan department yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Validasi input data
    const validatedData = createDepartmentSchema.parse(data)
    
    // Buat department baru menggunakan service
    const department = await departmentsService.createDepartment(validatedData)
    
    return createCorsResponse(department, { status: 201 })
    
  } catch (error) {
    console.error('Error creating department:', error)
    
    // Handle validation errors
    if (error instanceof Error) {
      if (error.message.includes('validation') || error.message.includes('parse')) {
        return createCorsResponse(
          { error: 'Invalid input data', details: error.message },
          { status: 400 }
        )
      }
      
      // Handle business logic errors (unique constraints, etc.)
      if (error.message.includes('already exists')) {
        return createCorsResponse(
          { error: 'Conflict', details: error.message },
          { status: 409 }
        )
      }
    }
    
    return createCorsResponse(
      { error: 'Failed to create department' },
      { status: 500 }
    )
  }
}