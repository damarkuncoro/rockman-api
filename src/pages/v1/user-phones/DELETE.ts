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

    const phones = await SERVICE.userPhones.findByUserId(userId);
    const ids = phones.map((p: any) => p.id);
    await Promise.all(ids.map((id: number) => SERVICE.userPhones.DELETE.Remove(id)));

    return addCorsHeaders(
      NextResponse.json({ message: 'User phones deleted successfully' })
    );
  } catch (error) {
    console.error('Error deleting user phones:', error);
    return addCorsHeaders(
      NextResponse.json({ error: 'Failed to delete user phones' }, { status: 500 })
    );
  }
}