import { pgTable, serial, integer, varchar, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { users } from "../users";

/**
 * Tabel untuk menyimpan nomor telepon user dengan dukungan nomor telepon default
 * Setiap user dapat memiliki multiple nomor telepon dan salah satunya bisa dijadikan default
 * 
 * Domain: User Management - Phone Numbers
 * Responsibility: Menyimpan dan mengelola nomor telepon user
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani data nomor telepon user
 * - DRY: Reusable structure seperti user_addresses
 * - KISS: Schema yang sederhana dan jelas
 * - SOLID: Separation of concerns untuk phone management
 */
export const userPhones = pgTable("user_phones", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	label: varchar({ length: 50 }).notNull(), // Label nomor (Utama, Kantor, Rumah, WhatsApp, dll)
	phoneNumber: varchar("phone_number", { length: 20 }).notNull(), // Nomor telepon
	countryCode: varchar("country_code", { length: 5 }).default('+62').notNull(), // Kode negara
	isDefault: boolean("is_default").default(false).notNull(), // Nomor telepon default
	isActive: boolean("is_active").default(true).notNull(), // Status aktif
	isVerified: boolean("is_verified").default(false).notNull(), // Status verifikasi
	verifiedAt: timestamp("verified_at", { withTimezone: true, mode: 'string' }), // Waktu verifikasi
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "user_phones_user_id_users_id_fk"
	}).onDelete("cascade"),
]);