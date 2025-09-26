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
    addressId: string;
  };
}

export async function PUT(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 PUT /api/v1/users/[id]/addresses/[addressId] called');

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

    const addressId = parseInt(params.addressId);
    if (isNaN(addressId) || addressId <= 0) {
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'ID alamat tidak valid',
            message: 'ID alamat harus berupa angka positif',
          },
          { status: 400 }
        )
      );
    }

    if (userId > 2147483647 || addressId > 2147483647) {
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'ID terlalu besar',
            message: 'ID melebihi batas maksimum yang diizinkan',
          },
          { status: 400 }
        )
      );
    }

    const requestBody = await request.json();

    const isOwner = await SERVICE.userAddresses.validateOwnership(addressId, userId);
    if (!isOwner) {
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'Alamat tidak ditemukan',
            message: 'Alamat tidak ditemukan atau bukan milik user ini',
          },
          { status: 404 }
        )
      );
    }

    const updatedAddress = await SERVICE.userAddresses.updateAddress(addressId, userId, requestBody);

    if (!updatedAddress) {
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'Alamat tidak ditemukan',
            message: 'Alamat tidak ditemukan atau gagal diupdate',
          },
          { status: 404 }
        )
      );
    }

    console.log('✅ Address updated successfully:', updatedAddress.id);

    return addCorsHeaders(
      NextResponse.json(
        {
          success: true,
          data: updatedAddress,
          message: 'Alamat berhasil diupdate',
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error('❌ Error updating address:', error);

    const apiError = error as { message?: string };
    let errorMessage = 'Gagal mengupdate alamat. Silakan coba lagi.';
    let statusCode = 500;

    if (apiError.message?.startsWith('{')) {
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