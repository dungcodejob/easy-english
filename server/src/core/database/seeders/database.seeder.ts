import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { TenantSeeder } from './tenant.seeder';

/**
 * Main Database Seeder
 * This seeder orchestrates all other seeders to populate the database
 */
export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Starting database seeding...');

    // Run seeders in order (important for maintaining referential integrity)
    return this.call(em, [TenantSeeder]);

    console.log('✅ Database seeding completed successfully!');
  }
}
