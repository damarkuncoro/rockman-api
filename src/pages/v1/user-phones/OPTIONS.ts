import { NextRequest, NextResponse } from 'next/server';
import { addCorsHeaders } from '@/utils/cors';

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }));
}