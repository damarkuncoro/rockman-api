// Domain-based exports for better organization

// User Management Domain
export * from "./users";
export * from "./sessions";
export * from "./departments";

// User Addresses - explicit exports to avoid conflicts
export {
  userAddresses,
  userAddressesRelations,
  type UserAddress,
  type NewUserAddress,
  createUserAddressSchema,
  updateUserAddressSchema,
  setDefaultAddressSchema,
  type CreateUserAddressInput,
  type UpdateUserAddressInput,
  type SetDefaultAddressInput,
  validateDefaultAddress,
  validateIndonesianPostalCode,
  validateCompleteAddress,
} from "./user_addresses";

// User Phones - explicit exports to avoid conflicts
export {
  userPhones,
  userPhonesRelations,
  type UserPhone,
  type NewUserPhone,
  validateDefaultPhone,
  validateInternationalPhoneNumber,
  validatePhoneDuplication,
  validatePhoneLabel,
  createUserPhoneSchema,
  updateUserPhoneSchema,
  setDefaultPhoneSchema,
  verifyPhoneSchema,
  bulkPhoneSchema,
  type CreateUserPhoneInput,
  type UpdateUserPhoneInput,
  type SetDefaultPhoneInput,
  type VerifyPhoneInput,
  type BulkPhoneInput,
} from "./user_phones";

// Re-export validateIndonesianPhoneNumber with specific naming
export { validateIndonesianPhoneNumber as validateIndonesianPhoneNumberForAddress } from "./user_addresses";
export { validateIndonesianPhoneNumber as validateIndonesianPhoneNumberForPhone } from "./user_phones";

// RBAC Domain  
export * from "./roles";
export * from "./features";
export * from "./feature_categories";
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
import { departments, departmentsRelations } from "./departments";
import { userAddresses, userAddressesRelations } from "./user_addresses";
import { userPhones, userPhonesRelations } from "./user_phones";
import { roles, rolesRelations } from "./roles";
import { features, featuresRelations } from "./features";
import { featureCategories, featureCategoriesRelations } from "./feature_categories";
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
  departments,
  userAddresses,
  userPhones,
} as const;

export const rbacTables = {
  roles,
  features,
  featureCategories,
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
  departmentsRelations,
  userAddressesRelations,
  userPhonesRelations,
} as const;

export const rbacRelations = {
  rolesRelations,
  featuresRelations,
  featureCategoriesRelations,
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