import { NextRequest, NextResponse } from 'next/server'
import { createUsersRepository } from '@/repositories/users/users.repository'
import { addCorsHeaders } from '@/utils/cors'

/**
 * APPROACH 1: Direct Repository
 * Menggunakan repository pattern untuk mengakses data users
 * 
 * @param request - NextRequest object
 * @returns NextResponse dengan data users dari repository atau error
 */
export async function handleRepositoryApproach(request: NextRequest) {
  console.log('\n🔧 APPROACH 1: Direct Repository')
  
  try {
    const usersRepository = createUsersRepository()
    console.log('🔍 Repository instance:', usersRepository)
    
    const repositoryUsers = await usersRepository.SELECT.All()
    console.log('✅ Direct Repository - Success:', repositoryUsers?.length, 'users found')
    console.log('📊 First user from repository:', repositoryUsers?.[0])
    
    if (repositoryUsers && repositoryUsers.length > 0) {
      return addCorsHeaders(NextResponse.json({
        method: 'repository',
        data: repositoryUsers,
        count: repositoryUsers.length,
        success: true
      }))
    } else {
      return addCorsHeaders(NextResponse.json({
        method: 'repository',
        data: [],
        count: 0,
        message: 'No users found',
        success: true
      }))
    }
  } catch (repositoryError) {
    console.error('❌ Direct Repository - Error:', repositoryError)
    return addCorsHeaders(NextResponse.json({
      method: 'repository',
      error: 'Repository method failed',
      details: repositoryError instanceof Error ? repositoryError.message : 'Unknown error',
      success: false
    }, { status: 500 }))
  }
}
