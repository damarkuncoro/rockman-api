import { pgTable, serial, integer, varchar, text, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { users } from "../users";

/**
 * Tabel untuk menyimpan alamat user dengan dukungan alamat default
 * Setiap user dapat memiliki multiple alamat dan salah satunya bisa dijadikan default
 */
export const userAddresses = pgTable("user_addresses", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	label: varchar({ length: 100 }).notNull(), // Label alamat (Rumah, Kantor, dll)
	recipientName: varchar("recipient_name", { length: 100 }).notNull(), // Nama penerima
	phoneNumber: varchar("phone_number", { length: 20 }).notNull(), // Nomor telepon
	addressLine1: text("address_line_1").notNull(), // Alamat lengkap baris 1
	addressLine2: text("address_line_2"), // Alamat lengkap baris 2 (opsional)
	city: varchar({ length: 100 }).notNull(), // Kota
	province: varchar({ length: 100 }).notNull(), // Provinsi
	postalCode: varchar("postal_code", { length: 10 }).notNull(), // Kode pos
	country: varchar({ length: 100 }).default('Indonesia').notNull(), // Negara
	isDefault: boolean("is_default").default(false).notNull(), // Alamat default
	isActive: boolean("is_active").default(true).notNull(), // Status aktif
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "user_addresses_user_id_users_id_fk"
	}).onDelete("cascade"),
]);