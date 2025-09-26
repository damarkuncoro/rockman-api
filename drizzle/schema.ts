import { pgTable, foreignKey, unique, serial, integer, text, timestamp, varchar, boolean, json } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const sessions = pgTable("sessions", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	refreshToken: text("refresh_token").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("sessions_refresh_token_unique").on(table.refreshToken),
]);

export const roles = pgTable("roles", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	grantsAll: boolean("grants_all").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("roles_name_unique").on(table.name),
]);

export const roleFeatures = pgTable("role_features", {
	id: serial().primaryKey().notNull(),
	roleId: integer("role_id").notNull(),
	featureId: integer("feature_id").notNull(),
	canCreate: boolean("can_create").default(false),
	canRead: boolean("can_read").default(false),
	canUpdate: boolean("can_update").default(false),
	canDelete: boolean("can_delete").default(false),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "role_features_role_id_roles_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.featureId],
			foreignColumns: [features.id],
			name: "role_features_feature_id_features_id_fk"
		}).onDelete("cascade"),
]);

export const routeFeatures = pgTable("route_features", {
	id: serial().primaryKey().notNull(),
	path: varchar({ length: 255 }).notNull(),
	method: varchar({ length: 10 }),
	featureId: integer("feature_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.featureId],
			foreignColumns: [features.id],
			name: "route_features_feature_id_features_id_fk"
		}).onDelete("cascade"),
]);

export const userRoles = pgTable("user_roles", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	roleId: integer("role_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_roles_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "user_roles_role_id_roles_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	passwordHash: text("password_hash").notNull(),
	active: boolean().default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	rolesUpdatedAt: timestamp("roles_updated_at", { withTimezone: true, mode: 'string' }),
	department: varchar({ length: 100 }),
	region: varchar({ length: 100 }),
	level: integer(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const policies = pgTable("policies", {
	id: serial().primaryKey().notNull(),
	featureId: integer("feature_id").notNull(),
	attribute: varchar({ length: 100 }).notNull(),
	operator: varchar({ length: 10 }).notNull(),
	value: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.featureId],
			foreignColumns: [features.id],
			name: "policies_feature_id_features_id_fk"
		}).onDelete("cascade"),
]);

export const accessLogs = pgTable("access_logs", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	roleId: integer("role_id"),
	featureId: integer("feature_id"),
	path: varchar({ length: 255 }).notNull(),
	method: varchar({ length: 10 }),
	decision: varchar({ length: 10 }).notNull(),
	reason: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "access_logs_user_id_users_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "access_logs_role_id_roles_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.featureId],
			foreignColumns: [features.id],
			name: "access_logs_feature_id_features_id_fk"
		}).onDelete("set null"),
]);

export const policyViolations = pgTable("policy_violations", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	featureId: integer("feature_id"),
	policyId: integer("policy_id"),
	attribute: varchar({ length: 100 }).notNull(),
	expectedValue: text("expected_value").notNull(),
	actualValue: text("actual_value"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "policy_violations_user_id_users_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.featureId],
			foreignColumns: [features.id],
			name: "policy_violations_feature_id_features_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.policyId],
			foreignColumns: [policies.id],
			name: "policy_violations_policy_id_policies_id_fk"
		}).onDelete("set null"),
]);

export const changeHistory = pgTable("change_history", {
	id: serial().primaryKey().notNull(),
	action: varchar({ length: 10 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: integer("user_id"),
	tableName: varchar("table_name", { length: 100 }).notNull(),
	recordId: integer("record_id").notNull(),
	oldValues: json("old_values"),
	newValues: json("new_values"),
	reason: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "change_history_user_id_users_id_fk"
		}).onDelete("set null"),
]);

export const features = pgTable("features", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	category: varchar({ length: 50 }).default('General'),
	categoryId: integer("category_id"),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [featureCategories.id],
			name: "features_category_id_feature_categories_id_fk"
		}),
	unique("features_name_unique").on(table.name),
]);

export const featureCategories = pgTable("feature_categories", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	slug: varchar({ length: 100 }).notNull(),
	color: varchar({ length: 7 }).default('#3B82F6'),
	icon: varchar({ length: 50 }).default('IconSettings'),
	isActive: boolean("is_active").default(true).notNull(),
	sortOrder: serial("sort_order").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("feature_categories_name_unique").on(table.name),
	unique("feature_categories_slug_unique").on(table.slug),
]);

// Tabel untuk menyimpan alamat user dengan dukungan alamat default
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
