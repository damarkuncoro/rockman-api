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
    const updatedAddress = await SERVICE.userAddresses.updateAddress(body.id, userId, body);

    if (!updatedAddress) {
      return addCorsHeaders(
        NextResponse.json({ error: 'Address not found or access denied' }, { status: 404 })
      );
    }

    return addCorsHeaders(NextResponse.json(updatedAddress));
  } catch (error) {
    console.error('Error updating user address:', error);
    const apiError = error as { message?: string };
    let errorMessage = 'Failed to update user address';
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