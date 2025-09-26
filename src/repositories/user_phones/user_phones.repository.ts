import { userPhones } from '@/db/schema';
import { Repository } from '@/core/core.repository';
import { and, eq, not } from 'drizzle-orm';
import db from '@/db';

export class UserPhonesRepository extends Repository<typeof userPhones> {
  constructor() {
    super(userPhones);
  }

  async findByUserId(userId: number, includeInactive = false) {
    const conditions = [eq(userPhones.userId, userId)];
    if (!includeInactive) {
      conditions.push(eq(userPhones.isActive, true));
    }
    return db.select().from(userPhones).where(and(...conditions));
  }

  async setAsDefault(phoneId: number, userId: number) {
    await db.transaction(async (tx) => {
      await tx
        .update(userPhones)
        .set({ isDefault: false })
        .where(and(eq(userPhones.userId, userId), not(eq(userPhones.id, phoneId))));

      await tx
        .update(userPhones)
        .set({ isDefault: true })
        .where(eq(userPhones.id, phoneId));
    });
    return this.SELECT.ById(phoneId);
  }

  async verifyPhone(phoneId: number, userId: number) {
    await db
      .update(userPhones)
      .set({ isVerified: true, verifiedAt: new Date().toISOString() })
      .where(and(eq(userPhones.id, phoneId), eq(userPhones.userId, userId)));
    return this.SELECT.ById(phoneId);
  }
}