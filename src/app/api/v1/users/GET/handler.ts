import { NextRequest, NextResponse } from 'next/server'
import { handleRepositoryApproach } from './repository'
import { handleServiceApproach } from './service'
import { handleRegistryApproach } from './registry'
import { handleRawApproach } from './raw'
import { addCorsHeaders } from '@/utils/cors'

/**
 * Handler untuk GET /api/v1/users - Mengambil semua users dengan berbagai pendekatan
 * Implementasi multiple approaches: Direct Repository, Direct Service, Registry, Direct API
 * 
 * @param request - NextRequest object
 * @returns NextResponse dengan data users atau error
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/v1/users called')
    
    // Ambil parameter method dari query string
    const { searchParams } = new URL(request.url)
    const method = searchParams.get('method') || 'registry'
    
    console.log('🎯 Selected method:', method)
    
    // Validasi method parameter
    const validMethods = ['repository', 'service', 'registry', 'raw', 'all']
    if (!validMethods.includes(method)) {
      return addCorsHeaders(NextResponse.json({
        error: 'Invalid method parameter',
        validMethods,
        success: false
      }, { status: 400 }))
    }

    // Route ke approach yang sesuai berdasarkan method
    switch (method) {
      case 'repository':
        return await handleRepositoryApproach(request)
      
      case 'service':
        return await handleServiceApproach(request)
      
      case 'registry':
        return await handleRegistryApproach(request)
      
      case 'raw':
        return await handleRawApproach(request)
      
      case 'all':
        return await handleAllApproaches(request)
      
      default:
        return addCorsHeaders(NextResponse.json({
          error: 'Invalid method parameter',
          validMethods,
          success: false
        }, { status: 400 }))
    }

  } catch (error) {
    console.error('❌ Error in GET /api/v1/users:', error)
    
    // Ambil method dari URL jika terjadi error di level atas
    let methodParam = 'unknown'
    try {
      const { searchParams } = new URL(request.url)
      methodParam = searchParams.get('method') || 'all'
    } catch (urlError) {
      console.error('❌ Error parsing URL:', urlError)
    }
    
    return addCorsHeaders(NextResponse.json(
      { 
        error: 'Failed to fetch users',
        method: methodParam,
        success: false
      },
      { status: 500 }
    ))
  }
}

/**
 * Handler untuk method 'all' - mengumpulkan hasil dari semua approach
 * 
 * @param request - NextRequest object
 * @returns NextResponse dengan hasil dari semua approach
 */
async function handleAllApproaches(request: NextRequest) {
  console.log('\n🔧 Collecting results from all methods for "all" response')
  
  const allResults: any = {
    method: 'all',
    results: {},
    success: true,
    count: 0
  }

  // Try Repository
  try {
    const repositoryResult = await handleRepositoryApproach(request)
    const repositoryData = await repositoryResult.json()
    if (repositoryData.success && repositoryData.data?.length > 0) {
      allResults.results.repository = {
        data: repositoryData.data,
        count: repositoryData.count,
        success: true
      }
      allResults.count = repositoryData.count
    } else {
      allResults.results.repository = {
        error: repositoryData.error || 'Repository method failed',
        success: false
      }
    }
  } catch (error) {
    allResults.results.repository = {
      error: 'Repository method failed',
      success: false
    }
  }

  // Try Service
  try {
    const serviceResult = await handleServiceApproach(request)
    const serviceData = await serviceResult.json()
    if (serviceData.success && serviceData.data?.length > 0) {
      allResults.results.service = {
        data: serviceData.data,
        count: serviceData.count,
        success: true
      }
      if (allResults.count === 0) allResults.count = serviceData.count
    } else {
      allResults.results.service = {
        error: serviceData.error || 'Service method failed',
        success: false
      }
    }
  } catch (error) {
    allResults.results.service = {
      error: 'Service method failed',
      success: false
    }
  }

  // Try Registry
  try {
    const registryResult = await handleRegistryApproach(request)
    const registryData = await registryResult.json()
    if (registryData.success && registryData.data?.length > 0) {
      allResults.results.registry = {
        data: registryData.data,
        count: registryData.count,
        success: true
      }
      if (allResults.count === 0) allResults.count = registryData.count
    } else {
      allResults.results.registry = {
        error: registryData.error || 'Registry method failed',
        success: false
      }
    }
  } catch (error) {
    allResults.results.registry = {
      error: 'Registry method failed',
      success: false
    }
  }

  // Try Raw SQL
  try {
    const rawResult = await handleRawApproach(request)
    const rawData = await rawResult.json()
    if (rawData.success && rawData.data?.length > 0) {
      allResults.results.raw = {
        data: rawData.data,
        count: rawData.count,
        success: true
      }
      if (allResults.count === 0) allResults.count = rawData.count
    } else {
      allResults.results.raw = {
        error: rawData.error || 'Raw SQL method failed',
        success: false
      }
    }
  } catch (error) {
    allResults.results.raw = {
      error: 'Raw SQL method failed',
      success: false
    }
  }

  return addCorsHeaders(NextResponse.json(allResults))
}