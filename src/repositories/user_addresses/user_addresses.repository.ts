import { userAddresses } from '@/db/schema';
import { Repository } from '@/core/core.repository';
import { and, eq, not } from 'drizzle-orm';
import db from '@/db';

export class UserAddressesRepository extends Repository<typeof userAddresses> {
  constructor() {
    super(userAddresses);
  }

  async findByUserId(userId: number, includeInactive = false) {
    const conditions = [eq(userAddresses.userId, userId)];
    if (!includeInactive) {
      conditions.push(eq(userAddresses.isActive, true));
    }
    return db.select().from(userAddresses).where(and(...conditions));
  }

  async setAsDefault(addressId: number, userId: number) {
    await db.transaction(async (tx) => {
      await tx
        .update(userAddresses)
        .set({ isDefault: false })
        .where(and(eq(userAddresses.userId, userId), not(eq(userAddresses.id, addressId))));

      await tx
        .update(userAddresses)
        .set({ isDefault: true })
        .where(eq(userAddresses.id, addressId));
    });
    return this.SELECT.ById(addressId);
  }
}