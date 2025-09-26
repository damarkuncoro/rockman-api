import { relations } from "drizzle-orm";
import { userPhones } from "./table";
import { users } from "../users";

/**
 * Relasi untuk tabel user_phones
 * 
 * Domain: User Management - Phone Numbers
 * Responsibility: Mendefinisikan relasi antar tabel untuk nomor telepon user
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani relasi nomor telepon user
 * - DRY: Reusable relations untuk query
 * - KISS: Relasi yang sederhana dan jelas
 * - SOLID: Separation of concerns untuk database relations
 */
export const userPhonesRelations = relations(userPhones, ({ one }) => ({
	user: one(users, {
		fields: [userPhones.userId],
		references: [users.id],
	}),
}));