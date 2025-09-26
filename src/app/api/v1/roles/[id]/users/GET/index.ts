/**
 * GET /api/v1/roles/[id]/users
 * 
 * Domain: Role Management - User Assignment
 * Responsibility: Mendapatkan semua users yang memiliki role tertentu
 * 
 * Menggunakan Registry Pattern untuk akses service yang terpusat
 * Mengikuti prinsip:
 * - SRP: Hanya menangani pengambilan users dalam role
 * - DRY: Menggunakan service registry yang sudah ada
 * - KISS: Interface sederhana untuk mendapatkan role users
 * - SOLID: Dependency injection melalui registry
 */

import { NextRequest, NextResponse } from 'next/server'
import { SERVICE } from '@/core/core.service.registry'
// Import services untuk memastikan registrasi ke SERVICE registry
import '@/services/database/roles/roles.service'
import '@/services/database/user_roles/user_roles.service'
import '@/services/database/users/users.service'

/**
 * Interface untuk response role users
 */
interface RoleUsersResponse {
  roleId: number
  roleName: string
  users: Array<{
    id: number
    name: string
    email: string
    departmentId?: number | null
    createdAt: Date
    updatedAt: Date
  }>
  totalUsers: number
}

/**
 * GET Handler untuk mendapatkan users dalam role
 * 
 * @param request - NextRequest object
 * @param params - Route parameters berisi role ID
 * @returns NextResponse dengan data users dalam role atau error
 * 
 * @example
 * GET /api/v1/roles/1/users
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "roleId": 1,
 *     "roleName": "admin",
 *     "users": [
 *       {
 *         "id": 123,
 *         "name": "John Doe",
 *         "email": "john@example.com",
 *         "departmentId": 1,
 *         "createdAt": "2024-01-01T00:00:00.000Z",
 *         "updatedAt": "2024-01-01T00:00:00.000Z"
 *       }
 *     ],
 *     "totalUsers": 1
 *   }
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('\n🔍 GET /api/v1/roles/[id]/users - Registry Approach')
  
  try {
    // Await params sebelum menggunakan propertinya (Next.js 15 requirement)
    const resolvedParams = await params
    
    // Validasi parameter ID
    const roleId = parseInt(resolvedParams.id)
    if (isNaN(roleId) || roleId <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid role ID',
        message: 'Role ID harus berupa angka positif'
      }, { status: 400 })
    }

    console.log(`📋 Mengambil users untuk role ID: ${roleId}`)

    // Cek apakah roles service terdaftar di registry
    if (!SERVICE.has('roles')) {
      console.error('❌ Roles service tidak terdaftar di SERVICE registry')
      return NextResponse.json({
        success: false,
        error: 'Roles service not available',
        message: 'Service roles belum terdaftar di registry'
      }, { status: 503 })
    }

    // Cek apakah user_roles service terdaftar di registry
    if (!SERVICE.has('user_roles')) {
      console.error('❌ User roles service tidak terdaftar di SERVICE registry')
      return NextResponse.json({
        success: false,
        error: 'User roles service not available',
        message: 'Service user_roles belum terdaftar di registry'
      }, { status: 503 })
    }

    // Cek apakah users service terdaftar di registry
    if (!SERVICE.has('users')) {
      console.error('❌ Users service tidak terdaftar di SERVICE registry')
      return NextResponse.json({
        success: false,
        error: 'Users service not available',
        message: 'Service users belum terdaftar di registry'
      }, { status: 503 })
    }

    // Ambil service instances dari registry
    const rolesService = SERVICE.get('roles')
    const userRolesService = SERVICE.get('user_roles')
    const usersService = SERVICE.get('users')

    if (!rolesService || !userRolesService || !usersService) {
      return NextResponse.json({
        success: false,
        error: 'Service instances not available',
        message: 'Tidak dapat mengakses service instances dari registry'
      }, { status: 503 })
    }

    // Verifikasi role exists
    console.log('🔍 Memverifikasi keberadaan role...')
    const role = await (rolesService as any).GET.ById(roleId)
    if (!role) {
      return NextResponse.json({
        success: false,
        error: 'Role not found',
        message: `Role dengan ID ${roleId} tidak ditemukan`
      }, { status: 404 })
    }

    console.log(`✅ Role ditemukan: ${role.name}`)

    // Ambil user roles dari user_roles table berdasarkan role ID
    console.log('🔍 Mengambil user roles...')
    const userRoles = await (userRolesService as any).findByRoleId(roleId)
    
    if (!userRoles || userRoles.length === 0) {
      console.log('📝 Role tidak memiliki users')
      return NextResponse.json({
        success: true,
        data: {
          roleId: roleId,
          roleName: role.name,
          users: [],
          totalUsers: 0
        },
        message: 'Role tidak memiliki users'
      })
    }

    console.log(`📋 Ditemukan ${userRoles.length} user assignments untuk role`)

    // Ambil detail users berdasarkan user IDs
    const userIds = userRoles.map((ur: any) => ur.userId)
    console.log('🔍 Mengambil detail users:', userIds)

    const usersDetails = await Promise.all(
      userIds.map(async (userId: number) => {
        return await (usersService as any).GET.ById(userId)
      })
    )

    // Filter out null results dan format response
    const validUsers = usersDetails
      .filter(user => user !== null)
      .map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        departmentId: user.departmentId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))

    console.log(`✅ Berhasil mengambil ${validUsers.length} users untuk role ${roleId}`)

    const response: RoleUsersResponse = {
      roleId: roleId,
      roleName: role.name,
      users: validUsers,
      totalUsers: validUsers.length
    }

    const jsonResponse = NextResponse.json({
      success: true,
      data: response,
      message: `Berhasil mengambil ${validUsers.length} users untuk role ${roleId}`
    })

    // Tambahkan CORS headers untuk mengizinkan akses dari frontend
    jsonResponse.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    jsonResponse.headers.set('Access-Control-Allow-Credentials', 'true')

    return jsonResponse

  } catch (error) {
    console.error('❌ Error dalam GET /api/v1/roles/[id]/users:', error)
    
    const errorResponse = NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Terjadi kesalahan saat mengambil users dalam role',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })

    // Tambahkan CORS headers untuk error response juga
    errorResponse.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    errorResponse.headers.set('Access-Control-Allow-Credentials', 'true')

    return errorResponse
  }
}

/**
 * Export default untuk Next.js API route
 */
export default GET