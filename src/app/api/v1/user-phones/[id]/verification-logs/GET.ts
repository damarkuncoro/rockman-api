import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { changeHistory } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";
import { addCorsHeaders } from '@/utils/cors';

/**
 * GET /api/v1/user-phones/[id]/verification-logs
 * 
 * Domain: User Management - Phone Numbers
 * Responsibility: Mengambil log verifikasi nomor telepon user
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani pengambilan log verifikasi
 * - DRY: Menggunakan tabel change_history yang sudah ada
 * - KISS: Implementasi yang sederhana dan jelas
 * - SOLID: Separation of concerns untuk audit logs
 */

/**
 * Schema validasi untuk query parameters
 */
const querySchema = z.object({
  userId: z.string().transform(val => parseInt(val, 10)).pipe(
    z.number().int().positive("User ID harus berupa angka positif")
  ).optional(),
  page: z.string().optional().default("1").transform(val => parseInt(val, 10)),
  limit: z.string().optional().default("10").transform(val => parseInt(val, 10)),
});

/**
 * Handler untuk GET request
 * Mengambil log verifikasi dari tabel change_history
 * 
 * @param request - NextRequest object
 * @param params - Route parameters dengan id nomor telepon
 * @returns Response dengan daftar log verifikasi
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validasi parameter ID
    const phoneId = parseInt(params.id, 10);
    if (isNaN(phoneId) || phoneId <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "ID nomor telepon tidak valid" 
        },
        { status: 400 }
      );
    }

    // Parse dan validasi query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    const validatedQuery = querySchema.parse(queryParams);
    const { userId, page = 1, limit = 10 } = validatedQuery;

    // Hitung offset untuk pagination
    const offset = (page - 1) * limit;

    // Query untuk mengambil log verifikasi dari change_history
    // Filter berdasarkan table_name = 'user_phones' dan record_id = phoneId
    let query = db
      .select({
        id: changeHistory.id,
        userId: changeHistory.userId,
        action: changeHistory.action,
        oldValues: changeHistory.oldValues,
        newValues: changeHistory.newValues,
        reason: changeHistory.reason,
        createdAt: changeHistory.createdAt,
      })
      .from(changeHistory)
      .where(
        and(
          eq(changeHistory.tableName, 'user_phones'),
          eq(changeHistory.recordId, phoneId),
          // Filter berdasarkan userId jika disediakan
          userId ? eq(changeHistory.userId, userId) : undefined
        )
      )
      .orderBy(desc(changeHistory.createdAt))
      .limit(limit)
      .offset(offset);

    const logs = await query;

    // Query untuk menghitung total records
    const totalQuery = db
      .select({ count: changeHistory.id })
      .from(changeHistory)
      .where(
        and(
          eq(changeHistory.tableName, 'user_phones'),
          eq(changeHistory.recordId, phoneId),
          userId ? eq(changeHistory.userId, userId) : undefined
        )
      );

    const totalResult = await totalQuery;
    const total = totalResult.length;

    // Format response dengan informasi pagination
    const response = {
      success: true,
      data: logs.map((log: any) => ({
        id: log.id,
        userId: log.userId,
        action: log.action,
        oldValues: log.oldValues,
        newValues: log.newValues,
        reason: log.reason,
        timestamp: log.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };

    return addCorsHeaders(
      NextResponse.json(response, { status: 200 })
    );

  } catch (error) {
    console.error("Error fetching verification logs:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            message: "Parameter tidak valid",
            errors: error.issues.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        )
      );
    }

    // Handle database errors
    return addCorsHeaders(
      NextResponse.json(
        {
          success: false,
          message: "Terjadi kesalahan saat mengambil log verifikasi",
        },
        { status: 500 }
      )
    );
  }
}