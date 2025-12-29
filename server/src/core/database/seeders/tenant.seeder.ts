import { AccountEntity, Role, TenantEntity, UserEntity } from '@app/entities';
import { TenantPlan, TenantStatus } from '@app/entities/tenant.entity';
import { faker } from '@faker-js/faker';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';

/**
 * Tenant Seeder
 * Seeds tenants along with their associated users and accounts
 */
export class TenantSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🏢 Seeding Tenants, Users, and Accounts...');

    const tenantsData = await this.createTenants(em);

    console.log(
      `✅ Created ${tenantsData.length} tenants with users and accounts`,
    );
  }

  /**
   * Create sample tenants with associated users and accounts
   */
  private async createTenants(em: EntityManager): Promise<TenantEntity[]> {
    const tenants: TenantEntity[] = [];

    // Create a main demo tenant with admin user
    const demoTenant = await this.createDemoTenant(em);
    tenants.push(demoTenant);

    // Create additional random tenants
    const additionalTenantCount = 5;
    for (let i = 0; i < additionalTenantCount; i++) {
      const tenant = await this.createRandomTenant(em, i);
      tenants.push(tenant);
    }

    await em.flush();
    return tenants;
  }

  /**
   * Create a demo tenant with predefined data
   */
  private async createDemoTenant(em: EntityManager): Promise<TenantEntity> {
    // Check if demo tenant already exists
    const existingTenant = await em.findOne(TenantEntity, {
      slug: 'easy-english',
    });

    if (existingTenant) {
      console.log(
        '  ⚠️ Demo tenant "easy-english" already exists. Skipping creation.',
      );
      return existingTenant;
    }

    // Create demo tenant
    const tenant = new TenantEntity({
      name: 'Easy English Academy',
      slug: 'easy-english',
      description: 'Demo tenant for Easy English learning platform',
      plan: TenantPlan.ENTERPRISE,
      status: TenantStatus.ACTIVE,
      logoUrl:
        'https://via.placeholder.com/150/0000FF/808080?text=Easy+English',
      primaryColor: '#4F46E5',
      settings: {
        theme: 'light',
        language: 'en',
        timezone: 'Asia/Ho_Chi_Minh',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
    });

    em.persist(tenant);

    // Create admin user for demo tenant
    const adminUser = new UserEntity({
      name: 'Admin User',
      tenant: tenant,
      role: Role.ADMIN,
    });

    em.persist(adminUser);

    // Create admin account
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminAccount = new AccountEntity({
      username: 'admin',
      email: 'admin@easyenglish.com',
      passwordHash: hashedPassword,
      user: adminUser,
      tenant: tenant,
    });
    adminAccount.isActive = true;

    em.persist(adminAccount);

    // Create a regular user for demo tenant
    const regularUser = new UserEntity({
      name: 'John Doe',
      tenant: tenant,
      role: Role.USER,
    });

    em.persist(regularUser);

    // Create regular user account
    const regularHashedPassword = await bcrypt.hash('user123', 10);
    const regularAccount = new AccountEntity({
      username: 'johndoe',
      email: 'john.doe@easyenglish.com',
      passwordHash: regularHashedPassword,
      user: regularUser,
      tenant: tenant,
    });
    regularAccount.isActive = true;

    em.persist(regularAccount);

    console.log('  ✓ Created demo tenant: Easy English Academy');
    console.log('    - Admin: admin@easyenglish.com / admin123');
    console.log('    - User: john.doe@easyenglish.com / user123');

    return tenant;
  }

  /**
   * Create a random tenant with random user and account
   */
  private async createRandomTenant(
    em: EntityManager,
    index: number,
  ): Promise<TenantEntity> {
    const companyName = faker.company.name();
    const slug = faker.helpers.slugify(companyName).toLowerCase();

    // Randomly select a plan
    const plans = [
      TenantPlan.FREE,
      TenantPlan.BASIC,
      TenantPlan.PREMIUM,
      TenantPlan.ENTERPRISE,
    ];
    const randomPlan = faker.helpers.arrayElement(plans);

    const tenant = new TenantEntity({
      name: companyName,
      slug: `${slug}-${index + 1}`,
      description: faker.company.catchPhrase(),
      plan: randomPlan,
      status: faker.helpers.arrayElement([
        TenantStatus.ACTIVE,
        TenantStatus.ACTIVE,
        TenantStatus.ACTIVE, // Higher probability of active
        TenantStatus.SUSPENDED,
      ]),
      logoUrl: faker.image.avatar(),
      primaryColor: faker.color.rgb(),
      settings: {
        theme: faker.helpers.arrayElement(['light', 'dark', 'auto']),
        language: faker.helpers.arrayElement(['en', 'vi', 'fr', 'es']),
        timezone: 'Asia/Ho_Chi_Minh',
        notifications: {
          email: faker.datatype.boolean(),
          push: faker.datatype.boolean(),
          sms: faker.datatype.boolean(),
        },
      },
    });

    // Set subscription expiry if not free plan
    if (randomPlan !== TenantPlan.FREE) {
      tenant.subscriptionExpiresAt = faker.date.future({ years: 1 });
    }

    em.persist(tenant);

    // Create 2-5 users per tenant
    const userCount = faker.number.int({ min: 2, max: 5 });
    for (let i = 0; i < userCount; i++) {
      const isAdmin = i === 0; // First user is admin

      const user = new UserEntity({
        name: faker.person.fullName(),
        tenant: tenant,
        role: isAdmin ? Role.ADMIN : Role.USER,
      });

      em.persist(user);

      // Create account for user
      const username = faker.internet.username().toLowerCase();
      const hashedPassword = await bcrypt.hash('password123', 10);

      const account = new AccountEntity({
        username: `${username}-${index}-${i}`,
        email: `${username}-${index}-${i}@example.com`,
        passwordHash: hashedPassword,
        user: user,
        tenant: tenant,
      });
      account.isActive = faker.datatype.boolean({ probability: 0.9 }); // 90% active

      if (account.isActive && faker.datatype.boolean({ probability: 0.7 })) {
        account.lastLoginAt = faker.date.recent({ days: 30 });
      }

      em.persist(account);
    }

    console.log(`  ✓ Created tenant: ${companyName} (${randomPlan})`);

    return tenant;
  }
}
