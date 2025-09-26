import { NextRequest, NextResponse } from 'next/server';
import { SERVICE } from '@/core/core.service.registry';
import { addCorsHeaders } from '@/utils/cors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get('userId'));

    if (userId) {
      const phones = await SERVICE.userPhones.findByUserId(userId);
      return addCorsHeaders(NextResponse.json(phones));
    }

    const phones = await SERVICE.userPhones.GET.All();
    return addCorsHeaders(NextResponse.json(phones));
  } catch (error) {
    console.error('Error fetching user phones:', error);
    return addCorsHeaders(
      NextResponse.json({ error: 'Failed to fetch user phones' }, { status: 500 })
    );
  }
}