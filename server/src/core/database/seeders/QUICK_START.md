# Quick Start - Database Seeding

## 🚀 Run Seeders

```bash
# Build the project first
npm run build

# Run all seeders
npm run seed:run
```

## 🔐 Default Test Accounts

After seeding, you can login with:

### Admin Account

- **Email**: `admin@easyenglish.com`
- **Password**: `admin123`
- **Role**: ADMIN
- **Tenant**: Easy English Academy

### Regular User Account

- **Email**: `john.doe@easyenglish.com`
- **Password**: `user123`
- **Role**: USER
- **Tenant**: Easy English Academy

## 📊 What Gets Seeded?

- **1 Demo Tenant** (Easy English Academy) with 2 users
- **5 Random Tenants** with 2-5 users each
- Different subscription plans: FREE, BASIC, PREMIUM, ENTERPRISE
- Realistic data generated with Faker.js

## 🔄 Fresh Start

```bash
# Drop database, run migrations, and seed
npm run migration:fresh
npm run seed:run
```

## 📝 Additional Resources

See [README.md](./README.md) for detailed documentation.
