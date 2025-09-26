import { NextRequest, NextResponse } from 'next/server';
import { SERVICE } from '@/core/core.service.registry';
import { addCorsHeaders } from '@/utils/cors';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    console.log('🔍 GET /api/v1/users/[id]/addresses called');

    const userId = parseInt(params.id);

    if (isNaN(userId) || userId <= 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid user ID. Must be a positive number.',
      };
      return addCorsHeaders(NextResponse.json(response, { status: 400 }));
    }

    if (userId > 2147483647) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID is too large. Maximum value is 2147483647.',
      };
      return addCorsHeaders(NextResponse.json(response, { status: 400 }));
    }

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    console.log(`📋 Fetching addresses for user ID: ${userId}, includeInactive: ${includeInactive}`);

    const addresses = await SERVICE.userAddresses.findByUserId(userId, includeInactive);

    if (!addresses || addresses.length === 0) {
      const response: ApiResponse = {
        success: true,
        data: [],
        message: `Tidak ada alamat ditemukan untuk user ID ${userId}`,
        count: 0,
      };
      return addCorsHeaders(NextResponse.json(response));
    }

    const response: ApiResponse = {
      success: true,
      data: addresses,
      message: `Berhasil mengambil ${addresses.length} alamat untuk user ID ${userId}`,
      count: addresses.length,
    };

    console.log(`✅ Successfully fetched ${addresses.length} addresses for user ID: ${userId}`);
    return addCorsHeaders(NextResponse.json(response));
  } catch (error) {
    console.error('❌ Error fetching user addresses:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };

    return addCorsHeaders(NextResponse.json(response, { status: 500 }));
  }
}