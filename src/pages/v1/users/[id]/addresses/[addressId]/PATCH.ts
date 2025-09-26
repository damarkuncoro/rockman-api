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

export async function PATCH(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 PATCH /api/v1/users/[id]/addresses/[addressId] called');

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

    const allowedFields = ['label', 'recipientName', 'phoneNumber', 'addressLine1', 'addressLine2', 'city', 'province', 'postalCode', 'country', 'isDefault'];
    const updateFields = Object.keys(requestBody).filter(key => allowedFields.includes(key));

    if (updateFields.length === 0) {
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'Parameter tidak valid',
            message: 'Minimal satu field harus disediakan untuk update',
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

    if (requestBody.isDefault === true) {
      const defaultAddress = await SERVICE.userAddresses.setAsDefault(addressId, userId, { addressId });

      if (!defaultAddress) {
        return addCorsHeaders(
          NextResponse.json(
            {
              success: false,
              error: 'Alamat tidak ditemukan',
              message: 'Alamat tidak ditemukan atau gagal diset sebagai default',
            },
            { status: 404 }
          )
        );
      }

      console.log('✅ Address set as default successfully:', defaultAddress.id);

      return addCorsHeaders(
        NextResponse.json(
          {
            success: true,
            data: defaultAddress,
            message: 'Alamat berhasil diset sebagai default',
          },
          { status: 200 }
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
    console.error('❌ Error setting default address:', error);

    const apiError = error as { message?: string };
    let errorMessage = 'Gagal mengset alamat sebagai default. Silakan coba lagi.';
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