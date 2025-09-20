# Features Schema Module

## Overview
Module ini mengelola schema database untuk fitur/permission dalam sistem RBAC (Role-Based Access Control).

## Domain
**RBAC (Role-Based Access Control)**

## Responsibility
Mengelola fitur dan permission sistem yang digunakan untuk kontrol akses berbasis peran.

## Structure

### Core Files
- `table.ts` - Database schema definition untuk tabel features
- `relations.ts` - Database relations dengan tabel lain
- `type_safety.ts` - TypeScript types untuk type safety
- `index.ts` - Barrel exports untuk semua komponen

### Validations
- `validations/data_validation.ts` - Schema validasi untuk data layer
- `validations/api_validation.ts` - Schema validasi untuk API layer

## Usage

```typescript
// Import table schema
import { features } from "./features";

// Import types
import type { Feature, NewFeature } from "./features";

// Import validations
import { 
  createFeatureSchema,
  insertFeatureDataSchema 
} from "./features";
```

## Database Schema

### Features Table
- `id` - Primary key (serial)
- `name` - Nama fitur (varchar, unique)
- `description` - Deskripsi fitur (text, optional)
- `category` - Kategori fitur (varchar, default: "General")
- `createdAt` - Timestamp pembuatan

## Validation Schemas

### Data Layer
- `insertFeatureDataSchema` - Validasi untuk insert data
- `selectFeatureDataSchema` - Validasi untuk select data

### API Layer
- `createFeatureSchema` - Validasi untuk API create feature

## Design Principles
- **SRP**: Setiap file memiliki tanggung jawab spesifik
- **DRY**: Menggunakan shared schemas dari validation.ts
- **Barrel Pattern**: Single point import melalui index.ts
- **Type Safety**: Comprehensive TypeScript types