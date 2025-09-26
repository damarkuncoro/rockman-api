import { NextRequest, NextResponse } from 'next/server';
import { SERVICE } from '@/core/core.service.registry';
import { addCorsHeaders } from '@/utils/cors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newAddress = await SERVICE.userAddresses.createAddress(body.userId, body);
    return addCorsHeaders(NextResponse.json(newAddress, { status: 201 }));
  } catch (error) {
    console.error('Error creating user address:', error);
    const apiError = error as { message?: string };
    let errorMessage = 'Failed to create user address';
    let statusCode = 500;

    if (apiError.message?.startsWith('{')) {
      // Zod validation error
      errorMessage = 'Data tidak valid';
      statusCode = 400;
    }

    return addCorsHeaders(
      NextResponse.json({ error: errorMessage }, { status: statusCode })
    );
  }
}