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

export async function DELETE(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 DELETE /api/v1/users/[id]/addresses/[addressId] called');

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

    const isDeleted = await SERVICE.userAddresses.deleteAddress(addressId, userId);

    if (!isDeleted) {
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'Alamat tidak ditemukan',
            message: 'Alamat tidak ditemukan atau gagal dihapus',
          },
          { status: 404 }
        )
      );
    }

    console.log('✅ Address deleted successfully:', addressId);

    return addCorsHeaders(
      NextResponse.json(
        {
          success: true,
          message: 'Alamat berhasil dihapus',
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error('❌ Error deleting address:', error);

    const apiError = error as { message?: string };
    let errorMessage = 'Gagal menghapus alamat. Silakan coba lagi.';
    let statusCode = 500;

    if (apiError.message === 'Tidak dapat menghapus alamat default terakhir') {
      errorMessage = apiError.message;
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