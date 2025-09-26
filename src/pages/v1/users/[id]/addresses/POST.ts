import { NextRequest, NextResponse } from 'next/server';
import { SERVICE } from '@/core/core.service.registry';
import { addCorsHeaders } from '@/utils/cors';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface RequestParams {
  params: {
    id: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 POST /api/v1/users/[id]/addresses called');

    const userId = parseInt(params.id);
    if (isNaN(userId) || userId <= 0) {
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'ID user tidak valid',
            message: 'ID user harus berupa angka positif',
          },
          { status: 400 }
        )
      );
    }

    if (userId > 2147483647) {
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'ID user terlalu besar',
            message: 'ID user melebihi batas maksimum yang diizinkan',
          },
          { status: 400 }
        )
      );
    }

    const requestBody = await request.json();

    const newAddress = await SERVICE.userAddresses.createAddress(userId, requestBody);

    console.log('✅ Address created successfully:', newAddress.id);

    return addCorsHeaders(
      NextResponse.json(
        {
          success: true,
          data: newAddress,
          message: 'Alamat berhasil ditambahkan',
        },
        { status: 201 }
      )
    );
  } catch (error) {
    console.error('❌ Error creating address:', error);

    const apiError = error as { message?: string };
    let errorMessage = 'Gagal menambahkan alamat. Silakan coba lagi.';
    let statusCode = 500;

    if (apiError.message?.startsWith('[')) {
      // Zod validation error
      errorMessage = 'Data tidak valid';
      statusCode = 400;
    }

    return addCorsHeaders(
      NextResponse.json(
        {
          success: false,
          error: 'Terjadi kesalahan server',
          message: errorMessage,
        },
        { status: statusCode }
      )
    );
  }
}