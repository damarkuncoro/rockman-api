import { userAddresses } from '@/db/schema';
import { Service } from '@/core/core.service';
import { UserAddressesRepository } from '@/repositories/user_addresses/user_addresses.repository';
import { SERVICE } from '@/core/core.service.registry';
import { createUserAddressSchema, setDefaultAddressSchema, updateUserAddressSchema } from '@/db/schema/user_addresses/validations/api_validation';

class UserAddressesService extends Service<typeof userAddresses> {
  constructor() {
    super(new UserAddressesRepository());
  }

  async findByUserId(userId: number, includeInactive = false) {
    return (this.repository as UserAddressesRepository).findByUserId(userId, includeInactive);
  }

  async createAddress(userId: number, data: any) {
    const validationResult = createUserAddressSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error(JSON.stringify(validationResult.error.issues));
    }

    return this.repository.INSERT.One({
      userId,
      ...validationResult.data,
      country: validationResult.data.country || 'Indonesia',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async deleteAddress(addressId: number, userId: number) {
    const address = await this.repository.SELECT.ById(addressId);
    if (!address || address.userId !== userId) {
      return false;
    }

    if (address.isDefault) {
      const userAddresses = await this.findByUserId(userId, false);
      const activeAddresses = userAddresses.filter(addr => addr.id !== addressId);
      if (activeAddresses.length === 0) {
        throw new Error('Tidak dapat menghapus alamat default terakhir');
      }
    }

    return this.repository.DELETE.One(addressId);
  }

  async validateOwnership(addressId: number, userId: number) {
    const address = await this.repository.SELECT.ById(addressId);
    return !!address && address.userId === userId;
  }

  async setAsDefault(addressId: number, userId: number, data: any) {
    const validationResult = setDefaultAddressSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error(JSON.stringify(validationResult.error.issues));
    }

    if (validationResult.data.addressId !== addressId) {
      throw new Error('ID alamat di URL dan body request harus sama');
    }

    return (this.repository as UserAddressesRepository).setAsDefault(addressId, userId);
  }

  async updateAddress(addressId: number, userId: number, data: any) {
    const validationResult = updateUserAddressSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error(JSON.stringify(validationResult.error.issues));
    }

    if (Object.keys(validationResult.data).length === 0) {
      throw new Error('Tidak ada data untuk diupdate');
    }

    return this.repository.UPDATE.One(addressId, validationResult.data);
  }
}

export const userAddressesService = new UserAddressesService();
SERVICE.register('userAddresses', userAddressesService);