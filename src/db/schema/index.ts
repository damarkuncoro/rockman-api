// Domain-based exports for better organization

// User Management Domain
export * from "./users";
export * from "./sessions";

// RBAC Domain  
export * from "./roles";
export * from "./features";
export * from "./user_roles";
export * from "./role_features";

// ABAC Domain
export * from "./policies";
export * from "./route_features";

// Audit & Monitoring Domain
export * from "./access_logs";
export * from "./policy_violations";
export * from "./change_history";

// Import all tables and relations
import { users, usersRelations } from "./users";
import { sessions, sessionsRelations } from "./sessions";
import { roles, rolesRelations } from "./roles";
import { features, featuresRelations } from "./features";
import { policies, policiesRelations } from "./policies";
import { userRoles, userRolesRelations } from "./user_roles";
import { roleFeatures, roleFeaturesRelations } from "./role_features";
import { routeFeatures, routeFeaturesRelations } from "./route_features";
import { accessLogs, accessLogsRelations } from "./access_logs";
import { policyViolations, policyViolationsRelations } from "./policy_violations";
import { changeHistory, changeHistoryRelations } from "./change_history";

// Grouped table exports
export const userTables = {
  users,
  sessions,
} as const;

export const rbacTables = {
  roles,
  features,
  userRoles,
  roleFeatures,
} as const;

export const abacTables = {
  policies,
  routeFeatures,
} as const;

export const auditTables = {
  accessLogs,
  policyViolations,
  changeHistory,
} as const;

// Grouped relations exports
export const userRelations = {
  usersRelations,
  sessionsRelations,
} as const;

export const rbacRelations = {
  rolesRelations,
  featuresRelations,
  userRolesRelations,
  roleFeaturesRelations,
} as const;

export const abacRelations = {
  policiesRelations,
  routeFeaturesRelations,
} as const;

export const auditRelations = {
  accessLogsRelations,
  policyViolationsRelations,
  changeHistoryRelations,
} as const;

// All tables grouped by domain
export const allTables = {
  ...userTables,
  ...rbacTables,
  ...abacTables,
  ...auditTables,
} as const;

// All relations grouped by domain
export const allRelations = {
  ...userRelations,
  ...rbacRelations,
  ...abacRelations,
  ...auditRelations,
} as const;