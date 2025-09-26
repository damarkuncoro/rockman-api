import { NextRequest, NextResponse } from 'next/server';
import { SERVICE } from '@/core/core.service.registry';
import { addCorsHeaders } from '@/utils/cors';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  count?: number;
}

interface RequestParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 GET /api/v1/users/[id]/phones called');

    const userId = parseInt(params.id);

    if (isNaN(userId) || userId <= 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid user ID format. Must be a positive number.',
      };
      return addCorsHeaders(NextResponse.json(response, { status: 400 }));
    }

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const phones = await SERVICE.userPhones.findByUserId(userId, includeInactive);
    const count = phones.length;

    console.log(`📱 Found ${count} phones for user ${userId}`);

    const response: ApiResponse = {
      success: true,
      data: phones,
      count,
      message: count > 0 ? 'Phones retrieved successfully' : 'No phones found for this user',
    };

    return addCorsHeaders(NextResponse.json(response, { status: 200 }));
  } catch (error) {
    console.error('❌ Error in GET /api/v1/users/[id]/phones:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Internal server error while fetching phones',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };

    return addCorsHeaders(NextResponse.json(response, { status: 500 }));
  }
}

export async function POST(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('📱 POST /api/v1/users/[id]/phones called');

    const userId = parseInt(params.id);

    if (isNaN(userId) || userId <= 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid user ID format. Must be a positive number.',
      };
      return addCorsHeaders(NextResponse.json(response, { status: 400 }));
    }

    const body = await request.json();
    console.log('📝 Request body:', body);

    const newPhone = await SERVICE.userPhones.createPhone(userId, body);

    console.log(`✅ Phone created successfully for user ${userId}:`, newPhone.id);

    const response: ApiResponse = {
      success: true,
      data: newPhone,
      message: 'Phone created successfully',
    };

    return addCorsHeaders(NextResponse.json(response, { status: 201 }));
  } catch (error) {
    console.error('❌ Error in POST /api/v1/users/[id]/phones:', error);

    const apiError = error as { message?: string };
    let errorMessage = 'Internal server error while creating phone';
    let statusCode = 500;

    if (apiError.message?.startsWith('{')) {
      // Zod validation error
      errorMessage = 'Data tidak valid';
      statusCode = 400;
    } else if (
      apiError.message === 'Phone number already exists for this user' ||
      apiError.message === 'Phone label already exists for this user'
    ) {
      errorMessage = apiError.message;
      statusCode = 409;
    } else if (apiError.message === 'Invalid Indonesian phone number format') {
      errorMessage = apiError.message;
      statusCode = 400;
    }

    const response: ApiResponse = {
      success: false,
      error: errorMessage,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };

    return addCorsHeaders(NextResponse.json(response, { status: statusCode }));
  }
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  console.log('🔧 OPTIONS /api/v1/users/[id]/phones called');
  return addCorsHeaders(new NextResponse(null, { status: 200 }));
}