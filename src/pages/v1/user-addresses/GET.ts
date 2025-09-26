import { NextRequest, NextResponse } from 'next/server';
import { SERVICE } from '@/core/core.service.registry';
import { addCorsHeaders } from '@/utils/cors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get('userId'));

    if (userId) {
      const addresses = await SERVICE.userAddresses.findByUserId(userId);
      return addCorsHeaders(NextResponse.json(addresses));
    }

    const addresses = await SERVICE.userAddresses.GET.All();
    return addCorsHeaders(NextResponse.json(addresses));
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return addCorsHeaders(
      NextResponse.json({ error: 'Failed to fetch user addresses' }, { status: 500 })
    );
  }
}