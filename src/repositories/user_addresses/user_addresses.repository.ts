// rockman-api/src/repositories/user_addresses/user_addresses.repository.ts
import { Repository } from "../../core/core.repository"
import { userAddresses } from "../../db/schema/user_addresses"
import { eq, and } from "drizzle-orm"
import { InferSelectModel, InferInsertModel } from "drizzle-orm"
import db from "../../db"

// Type definitions untuk user addresses
type UserAddress = InferSelectModel<typeof userAddresses>
type NewUserAddress = InferInsertModel<typeof userAddresses>

/**
 * User Addresses Repository dengan Dependency Injection Pattern
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * Mengelola alamat user dengan dukungan alamat default
 */
export class UserAddressesRepository extends Repository<typeof userAddresses> {
  /**
   * Constructor untuk inisialisasi user addresses repository
   * @param table - Schema tabel user_addresses (default: userAddresses)
   */
  constructor(table = userAddresses) {
    super(table)
  }

  /**
   * Mencari alamat berdasarkan user ID
   * @param userId - ID user
   * @param includeInactive - Apakah menyertakan alamat yang tidak aktif (default: false)
   * @returns Promise array alamat user
   */
  async findByUserId(userId: number, includeInactive: boolean = false): Promise<UserAddress[]> {
    try {
      const whereConditions = [eq(userAddresses.userId, userId)]
      
      if (!includeInactive) {
        whereConditions.push(eq(userAddresses.isActive, true))
      }

      const addresses = await db
        .select()
        .from(userAddresses)
        .where(and(...whereConditions))
        .orderBy(userAddresses.isDefault, userAddresses.createdAt)
      
      return addresses
    } catch (error) {
      console.error('Error finding addresses by user ID:', error)
      throw new Error('Failed to fetch user addresses')
    }
  }

  /**
   * Mencari alamat default user
   * @param userId - ID user yang dicari alamat defaultnya
   * @returns Promise alamat default atau null
   */
  async findDefaultByUserId(userId: number): Promise<UserAddress | null> {
    try {
      const defaultAddress = await db
        .select()
        .from(userAddresses)
        .where(and(
          eq(userAddresses.userId, userId),
          eq(userAddresses.isDefault, true),
          eq(userAddresses.isActive, true)
        ))
        .limit(1)
      
      return defaultAddress[0] || null
    } catch (error) {
      console.error('Error finding default address:', error)
      throw new Error('Failed to fetch default address')
    }
  }

  /**
   * Membuat alamat baru dengan validasi alamat default
   * @param addressData - Data alamat baru
   * @returns Promise alamat yang dibuat
   */
  async createAddress(addressData: NewUserAddress): Promise<UserAddress> {
    try {
      // Jika alamat baru adalah default, hapus default dari alamat lain
      if (addressData.isDefault) {
        await this.removeDefaultStatus(addressData.userId)
      }

      const [newAddress] = await db
        .insert(userAddresses)
        .values({
          ...addressData,
          updatedAt: new Date().toISOString()
        })
        .returning()
      
      return newAddress
    } catch (error) {
      console.error('Error creating address:', error)
      throw new Error('Failed to create address')
    }
  }

  /**
   * Update alamat dengan validasi alamat default
   * @param addressId - ID alamat yang akan diupdate
   * @param userId - ID user pemilik alamat
   * @param updateData - Data yang akan diupdate
   * @returns Promise alamat yang diupdate
   */
  async updateAddress(
    addressId: number, 
    userId: number, 
    updateData: Partial<NewUserAddress>
  ): Promise<UserAddress | null> {
    try {
      // Jika mengubah menjadi default, hapus default dari alamat lain
      if (updateData.isDefault) {
        await this.removeDefaultStatus(userId)
      }

      const [updatedAddress] = await db
        .update(userAddresses)
        .set({
          ...updateData,
          updatedAt: new Date().toISOString()
        })
        .where(and(
          eq(userAddresses.id, addressId),
          eq(userAddresses.userId, userId)
        ))
        .returning()
      
      return updatedAddress || null
    } catch (error) {
      console.error('Error updating address:', error)
      throw new Error('Failed to update address')
    }
  }

  /**
   * Set alamat sebagai default
   * @param addressId - ID alamat yang akan dijadikan default
   * @param userId - ID user pemilik alamat
   * @returns Promise alamat yang diupdate
   */
  async setAsDefault(addressId: number, userId: number): Promise<UserAddress | null> {
    try {
      // Hapus status default dari alamat lain
      await this.removeDefaultStatus(userId)

      // Set alamat sebagai default
      const [defaultAddress] = await db
        .update(userAddresses)
        .set({
          isDefault: true,
          updatedAt: new Date().toISOString()
        })
        .where(and(
          eq(userAddresses.id, addressId),
          eq(userAddresses.userId, userId)
        ))
        .returning()
      
      return defaultAddress || null
    } catch (error) {
      console.error('Error setting default address:', error)
      throw new Error('Failed to set default address')
    }
  }

  /**
   * Soft delete alamat (set isActive = false)
   * @param addressId - ID alamat yang akan dihapus
   * @param userId - ID user pemilik alamat
   * @returns Promise boolean success
   */
  async deleteAddress(addressId: number, userId: number): Promise<boolean> {
    try {
      const [deletedAddress] = await db
        .update(userAddresses)
        .set({
          isActive: false,
          updatedAt: new Date().toISOString()
        })
        .where(and(
          eq(userAddresses.id, addressId),
          eq(userAddresses.userId, userId)
        ))
        .returning()
      
      return !!deletedAddress
    } catch (error) {
      console.error('Error deleting address:', error)
      throw new Error('Failed to delete address')
    }
  }

  /**
   * Helper method untuk menghapus status default dari semua alamat user
   * @param userId - ID user
   * @private
   */
  private async removeDefaultStatus(userId: number): Promise<void> {
    await db
      .update(userAddresses)
      .set({
        isDefault: false,
        updatedAt: new Date().toISOString()
      })
      .where(eq(userAddresses.userId, userId))
  }

  /**
   * Validasi apakah alamat milik user tertentu
   * @param addressId - ID alamat
   * @param userId - ID user
   * @returns Promise boolean ownership
   */
  async validateOwnership(addressId: number, userId: number): Promise<boolean> {
    try {
      const address = await db
        .select({ id: userAddresses.id })
        .from(userAddresses)
        .where(and(
          eq(userAddresses.id, addressId),
          eq(userAddresses.userId, userId),
          eq(userAddresses.isActive, true)
        ))
        .limit(1)
      
      return address.length > 0
    } catch (error) {
      console.error('Error validating address ownership:', error)
      return false
    }
  }
}

/**
 * Factory function untuk membuat instance UserAddressesRepository
 * Memungkinkan dependency injection dan testing yang mudah
 * @returns Instance UserAddressesRepository
 */
export function createUserAddressesRepository(): UserAddressesRepository {
  return new UserAddressesRepository()
}

/**
 * Singleton instance untuk digunakan di aplikasi
 * Mengikuti pattern yang konsisten dengan repository lain
 */
export const userAddressesRepository = createUserAddressesRepository()

/**
 * Alias untuk backward compatibility dan konsistensi naming
 */
export const UserAddressRepository = userAddressesRepository