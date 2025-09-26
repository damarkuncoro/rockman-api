import { NextRequest, NextResponse } from 'next/server';
import { SERVICE } from '@/core/core.service.registry';
import { addCorsHeaders } from '@/utils/cors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPhone = await SERVICE.userPhones.createPhone(body.userId, body);
    return addCorsHeaders(NextResponse.json(newPhone, { status: 201 }));
  } catch (error) {
    console.error('Error creating user phone:', error);
    const apiError = error as { message?: string };
    let errorMessage = 'Failed to create user phone';
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