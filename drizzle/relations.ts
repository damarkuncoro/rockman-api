import { relations } from "drizzle-orm/relations";
import { users, sessions, roles, roleFeatures, features, routeFeatures, userRoles, policies, accessLogs, policyViolations, changeHistory, featureCategories } from "./schema";

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	sessions: many(sessions),
	userRoles: many(userRoles),
	accessLogs: many(accessLogs),
	policyViolations: many(policyViolations),
	changeHistories: many(changeHistory),
}));

export const roleFeaturesRelations = relations(roleFeatures, ({one}) => ({
	role: one(roles, {
		fields: [roleFeatures.roleId],
		references: [roles.id]
	}),
	feature: one(features, {
		fields: [roleFeatures.featureId],
		references: [features.id]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	roleFeatures: many(roleFeatures),
	userRoles: many(userRoles),
	accessLogs: many(accessLogs),
}));

export const featuresRelations = relations(features, ({one, many}) => ({
	roleFeatures: many(roleFeatures),
	routeFeatures: many(routeFeatures),
	policies: many(policies),
	accessLogs: many(accessLogs),
	policyViolations: many(policyViolations),
	featureCategory: one(featureCategories, {
		fields: [features.categoryId],
		references: [featureCategories.id]
	}),
}));

export const routeFeaturesRelations = relations(routeFeatures, ({one}) => ({
	feature: one(features, {
		fields: [routeFeatures.featureId],
		references: [features.id]
	}),
}));

export const userRolesRelations = relations(userRoles, ({one}) => ({
	user: one(users, {
		fields: [userRoles.userId],
		references: [users.id]
	}),
	role: one(roles, {
		fields: [userRoles.roleId],
		references: [roles.id]
	}),
}));

export const policiesRelations = relations(policies, ({one, many}) => ({
	feature: one(features, {
		fields: [policies.featureId],
		references: [features.id]
	}),
	policyViolations: many(policyViolations),
}));

export const accessLogsRelations = relations(accessLogs, ({one}) => ({
	user: one(users, {
		fields: [accessLogs.userId],
		references: [users.id]
	}),
	role: one(roles, {
		fields: [accessLogs.roleId],
		references: [roles.id]
	}),
	feature: one(features, {
		fields: [accessLogs.featureId],
		references: [features.id]
	}),
}));

export const policyViolationsRelations = relations(policyViolations, ({one}) => ({
	user: one(users, {
		fields: [policyViolations.userId],
		references: [users.id]
	}),
	feature: one(features, {
		fields: [policyViolations.featureId],
		references: [features.id]
	}),
	policy: one(policies, {
		fields: [policyViolations.policyId],
		references: [policies.id]
	}),
}));

export const changeHistoryRelations = relations(changeHistory, ({one}) => ({
	user: one(users, {
		fields: [changeHistory.userId],
		references: [users.id]
	}),
}));

export const featureCategoriesRelations = relations(featureCategories, ({many}) => ({
	features: many(features),
}));