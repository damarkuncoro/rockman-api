import { NextRequest, NextResponse } from 'next/server';
import { SERVICE } from '@/core/core.service.registry';
import { addCorsHeaders } from '@/utils/cors';

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get('userId'));

    if (!userId) {
      return addCorsHeaders(
        NextResponse.json({ error: 'userId is required' }, { status: 400 })
      );
    }

    const body = await request.json();
    const updatedPhone = await SERVICE.userPhones.updatePhone(body.id, userId, body);

    if (!updatedPhone) {
      return addCorsHeaders(
        NextResponse.json({ error: 'Phone not found or access denied' }, { status: 404 })
      );
    }

    return addCorsHeaders(NextResponse.json(updatedPhone));
  } catch (error) {
    console.error('Error updating user phone:', error);
    const apiError = error as { message?: string };
    let errorMessage = 'Failed to update user phone';
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

    return addCorsHeaders(
      NextResponse.json({ error: errorMessage }, { status: statusCode })
    );
  }
}