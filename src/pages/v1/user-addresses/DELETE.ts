import { NextRequest, NextResponse } from 'next/server';
import { SERVICE } from '@/core/core.service.registry';
import { addCorsHeaders } from '@/utils/cors';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get('userId'));

    if (!userId) {
      return addCorsHeaders(
        NextResponse.json({ error: 'userId is required' }, { status: 400 })
      );
    }

    const addresses = await SERVICE.userAddresses.findByUserId(userId);
    const ids = addresses.map((a: any) => a.id);
    await Promise.all(ids.map((id: number) => SERVICE.userAddresses.DELETE.Remove(id)));

    return addCorsHeaders(
      NextResponse.json({ message: 'User addresses deleted successfully' })
    );
  } catch (error) {
    console.error('Error deleting user addresses:', error);
    return addCorsHeaders(
      NextResponse.json({ error: 'Failed to delete user addresses' }, { status: 500 })
    );
  }
}