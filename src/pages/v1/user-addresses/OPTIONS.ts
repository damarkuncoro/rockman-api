import { NextResponse } from 'next/server';
import { addCorsHeaders } from '@/utils/cors';

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}