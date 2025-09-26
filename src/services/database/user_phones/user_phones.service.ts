import { userPhones } from '@/db/schema';
import { Service } from '@/core/core.service';
import { UserPhonesRepository } from '@/repositories/user_phones/user_phones.repository';
import { SERVICE } from '@/core/core.service.registry';
import { setDefaultPhoneSchema, verifyPhoneSchema, updateUserPhoneSchema, createUserPhoneSchema } from '@/db/schema/user_phones/validations/api_validation';
import { validateIndonesianPhoneNumber } from '@/db/schema/user_phones/validations/data_validation';

class UserPhonesService extends Service<typeof userPhones> {
  constructor() {
    super(new UserPhonesRepository());
  }

  async findByUserId(userId: number, includeInactive = false) {
    return (this.repository as UserPhonesRepository).findByUserId(userId, includeInactive);
  }

  async deletePhone(phoneId: number, userId: number) {
    const phone = await this.repository.SELECT.ById(phoneId);
    if (!phone || phone.userId !== userId) {
      return false;
    }

    if (phone.isDefault) {
      const userPhones = await this.findByUserId(userId, false);
      const activePhones = userPhones.filter(p => p.id !== phoneId);
      if (activePhones.length > 0) {
        await (this.repository as UserPhonesRepository).setAsDefault(activePhones[0].id, userId);
      }
    }

    return this.repository.DELETE.One(phoneId);
  }

  async validateOwnership(phoneId: number, userId: number) {
    const phone = await this.repository.SELECT.ById(phoneId);
    return !!phone && phone.userId === userId;
  }

  async setAsDefault(phoneId: number, userId: number, data: any) {
    const validationResult = setDefaultPhoneSchema.safeParse({ ...data, phoneId });
    if (!validationResult.success) {
      throw new Error(JSON.stringify(validationResult.error.issues));
    }

    return (this.repository as UserPhonesRepository).setAsDefault(phoneId, userId);
  }

  async verifyPhone(phoneId: number, userId: number, data: any) {
    const validationResult = verifyPhoneSchema.safeParse({ ...data, phoneId });
    if (!validationResult.success) {
      throw new Error(JSON.stringify(validationResult.error.issues));
    }

    // TODO: Implement actual verification logic
    return (this.repository as UserPhonesRepository).verifyPhone(phoneId, userId);
  }

  async updatePhone(phoneId: number, userId: number, data: any) {
    const validationResult = updateUserPhoneSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error(JSON.stringify(validationResult.error.issues));
    }

    const updateData = validationResult.data;

    if (updateData.phoneNumber || updateData.label) {
      const existingPhones = await this.findByUserId(userId, true);
      if (updateData.phoneNumber) {
        const duplicatePhone = existingPhones.find(phone =>
          phone.phoneNumber === updateData.phoneNumber && phone.id !== phoneId
        );
        if (duplicatePhone) {
          throw new Error('Phone number already exists for this user');
        }
      }
      if (updateData.label) {
        const duplicateLabel = existingPhones.find(phone =>
          phone.label === updateData.label && phone.id !== phoneId
        );
        if (duplicateLabel) {
          throw new Error('Phone label already exists for this user');
        }
      }
    }

    if (updateData.phoneNumber && updateData.countryCode === '+62' &&
        !validateIndonesianPhoneNumber(updateData.phoneNumber)) {
      throw new Error('Invalid Indonesian phone number format');
    }

    return this.repository.UPDATE.One(phoneId, updateData);
  }

  async createPhone(userId: number, data: any) {
    const validationResult = createUserPhoneSchema.safeParse({ ...data, userId });
    if (!validationResult.success) {
      throw new Error(JSON.stringify(validationResult.error.issues));
    }

    const phoneData = validationResult.data;

    const existingPhones = await this.findByUserId(userId, true);
    const duplicatePhone = existingPhones.find(phone => phone.phoneNumber === phoneData.phoneNumber);
    if (duplicatePhone) {
      throw new Error('Phone number already exists for this user');
    }

    const duplicateLabel = existingPhones.find(phone => phone.label === phoneData.label);
    if (duplicateLabel) {
      throw new Error('Phone label already exists for this user');
    }

    if (phoneData.countryCode === '+62' && !validateIndonesianPhoneNumber(phoneData.phoneNumber)) {
      throw new Error('Invalid Indonesian phone number format');
    }

    return this.repository.INSERT.One({
      ...phoneData,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  }
}

export const userPhonesService = new UserPhonesService();
SERVICE.register('userPhones', userPhonesService);