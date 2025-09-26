/**
 * Route handler untuk /api/v1/users/[id]/change-histories
 * 
 * Endpoint untuk mendapatkan riwayat perubahan data user tertentu
 */

import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { changeHistory } from '@/db/schema/change_history';
import { users } from '@/db/schema/users';
import { eq, desc } from 'drizzle-orm';

/**
 * GET Handler - Mendapatkan change histories untuk user tertentu
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Credentials': 'true',
          }
        }
      )
    }

    // Ambil change histories untuk user tertentu
    const histories = await db
      .select({
        id: changeHistory.id,
        userId: changeHistory.userId,
        tableName: changeHistory.tableName,
        recordId: changeHistory.recordId,
        action: changeHistory.action,
        oldValues: changeHistory.oldValues,
        newValues: changeHistory.newValues,
        createdAt: changeHistory.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        }
      })
      .from(changeHistory)
      .leftJoin(users, eq(changeHistory.userId, users.id))
      .where(eq(changeHistory.recordId, userId))
      .orderBy(changeHistory.createdAt)

    return NextResponse.json(histories, {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true',
      }
    })

  } catch (error) {
    console.error('Error fetching change histories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    )
  }
}

/**
 * OPTIONS Handler untuk CORS preflight requests
 */
export async function OPTIONS() {
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
  
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  })
}