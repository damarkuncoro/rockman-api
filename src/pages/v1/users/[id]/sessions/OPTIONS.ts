import { createOptionsResponse } from "@/utils/cors"

/**
 * OPTIONS /api/v1/users/[id]/sessions - CORS preflight handler
 * 
 * Menangani CORS preflight requests untuk endpoint sessions
 * Mengikuti standar CORS untuk cross-origin requests
 * 
 * @returns NextResponse dengan CORS headers
 */
export async function OPTIONS() {
  return createOptionsResponse()
}