# Policies Schema Module

## Overview
Module ini mengelola schema database untuk aturan akses berbasis atribut dalam sistem ABAC (Attribute-Based Access Control).

## Domain
**RBAC/ABAC (Role-Based & Attribute-Based Access Control)**

## Responsibility
Mengelola aturan akses berdasarkan atribut pengguna seperti department, region, level, dll.

## Structure

### Core Files
- `table.ts` - Database schema definition untuk tabel policies
- `relations.ts` - Database relations dengan tabel features
- `type_safety.ts` - TypeScript types untuk type safety
- `index.ts` - Barrel exports untuk semua komponen

### Validations
- `validations/data_validation.ts` - Schema validasi untuk data layer
- `validations/api_validation.ts` - Schema validasi untuk API layer

## Usage

```typescript
// Import table schema
import { policies } from "./policies";

// Import types
import type { Policy, NewPolicy } from "./policies";

// Import validations
import { 
  createPolicySchema,
  insertPolicyDataSchema 
} from "./policies";
```

## Database Schema

### Policies Table
- `id` - Primary key (serial)
- `featureId` - Foreign key ke features table
- `attribute` - Nama atribut (varchar, e.g., 'department', 'region')
- `operator` - Operator perbandingan (enum: '==', '!=', '>', '>=', '<', '<=', 'in')
- `value` - Nilai untuk perbandingan (text)
- `createdAt` - Timestamp pembuatan

## Relations
- **feature**: Many-to-one dengan features table

## Validation Schemas

### Data Layer
- `insertPolicyDataSchema` - Validasi untuk insert data
- `selectPolicyDataSchema` - Validasi untuk select data

### API Layer
- `createPolicySchema` - Validasi untuk API create policy (dengan enum terbatas untuk attribute)

## Attribute Types
API layer membatasi attribute ke:
- `department` - Departemen pengguna
- `region` - Wilayah pengguna  
- `level` - Level/tingkat pengguna

## Operators
- `==` - Equal
- `!=` - Not equal
- `>` - Greater than
- `>=` - Greater than or equal
- `<` - Less than
- `<=` - Less than or equal
- `in` - In array (untuk multiple values)

## Design Principles
- **SRP**: Setiap file memiliki tanggung jawab spesifik
- **DRY**: Menggunakan shared schemas dari validation.ts
- **Barrel Pattern**: Single point import melalui index.ts
- **Type Safety**: Comprehensive TypeScript types