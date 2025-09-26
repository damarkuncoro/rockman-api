/**
 * Route handler untuk /api/v1/users/[id]/access-logs
 * 
 * Endpoint untuk mendapatkan access logs user tertentu
 */

import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { accessLogs } from '@/db/schema/access_logs';
import { users } from '@/db/schema/users';
import { roles } from '@/db/schema/roles';
import { features } from '@/db/schema/features';
import { eq, desc } from 'drizzle-orm';

/**
 * GET Handler - Mendapatkan access logs untuk user tertentu
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

    // Ambil access logs untuk user tertentu
    const logs = await db
      .select({
        id: accessLogs.id,
        userId: accessLogs.userId,
        roleId: accessLogs.roleId,
        featureId: accessLogs.featureId,
        path: accessLogs.path,
        method: accessLogs.method,
        decision: accessLogs.decision,
        reason: accessLogs.reason,
        createdAt: accessLogs.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        role: {
          id: roles.id,
          name: roles.name,
        },
        feature: {
          id: features.id,
          name: features.name,
          category: features.category,
        }
      })
      .from(accessLogs)
      .leftJoin(users, eq(accessLogs.userId, users.id))
      .leftJoin(roles, eq(accessLogs.roleId, roles.id))
      .leftJoin(features, eq(accessLogs.featureId, features.id))
      .where(eq(accessLogs.userId, userId))
      .orderBy(accessLogs.createdAt)

    return NextResponse.json(logs, {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true',
      }
    })

  } catch (error) {
    console.error('Error fetching access logs:', error)
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