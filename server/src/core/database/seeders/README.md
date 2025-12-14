# Database Seeders

This directory contains database seeders for populating the database with sample data.

## Overview

The seeding system uses MikroORM's Seeder feature to create realistic test data using Faker.js.

## Available Seeders

### 1. DatabaseSeeder (Main Seeder)

The main seeder that orchestrates all other seeders. This ensures data is seeded in the correct order to maintain referential integrity.

### 2. TenantSeeder

Seeds tenants along with their associated users and accounts in a single transaction.

**Default Data Created:**

- **Demo Tenant**: "Easy English Academy"
  - Admin Account:
    - Email: `admin@easyenglish.com`
    - Password: `admin123`
    - Role: ADMIN
  - User Account:
    - Email: `john.doe@easyenglish.com`
    - Password: `user123`
    - Role: USER

- **5 Random Tenants**: Each with 2-5 users and accounts
  - Random company names and data
  - Various subscription plans (FREE, BASIC, PREMIUM, ENTERPRISE)
  - Random status (mostly ACTIVE)

## Usage

### Run All Seeders

```bash
npm run seed:run
```

This will execute the `DatabaseSeeder`, which in turn runs all child seeders.

### Create a New Seeder

```bash
npm run seed:create --name=MyNewSeeder
```

### Run Specific Seeder

```bash
mikro-orm seeder:run --class=TenantSeeder --config ./src/core/configs/database.config.ts
```

## Database Workflow

For a fresh start, you can combine migrations and seeding:

```bash
# Drop all tables, run migrations, and seed data
npm run migration:fresh
npm run seed:run
```

## Seeder Structure

```
seeders/
├── database.seeder.ts    # Main orchestrator
├── tenant.seeder.ts      # Seeds tenants, users, and accounts
└── index.ts              # Exports all seeders
```

## Development

### Creating a New Seeder

1. Create a new seeder file:

```typescript
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class MySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Your seeding logic here
  }
}
```

2. Add it to `database.seeder.ts`:

```typescript
await this.call(em, [
  TenantSeeder,
  MySeeder, // Add your new seeder
]);
```

3. Export it from `index.ts`:

```typescript
export * from './my.seeder';
```

## Important Notes

- Seeders are meant for **development and testing** only
- Do not run seeders in production unless you know what you're doing
- All passwords in seeded accounts are hashed using bcrypt
- The seeder uses transactions to ensure data consistency
- If seeding fails, all changes are rolled back

## Default Credentials

For quick testing, use these credentials:

| Email                    | Password | Role  |
| ------------------------ | -------- | ----- |
| admin@easyenglish.com    | admin123 | ADMIN |
| john.doe@easyenglish.com | user123  | USER  |

## Customization

You can customize the seeded data by modifying the seeder files:

- `TenantSeeder`: Change number of tenants, users per tenant, etc.
- Adjust faker options for different data patterns
- Modify default tenant settings and configurations
