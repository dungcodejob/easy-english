import { Migration } from '@mikro-orm/migrations';

/**
 * Migration to create topics table for vocabulary topic management.
 * 
 * Creates table with:
 * - UUID primary key
 * - Unique constraints on name and slug
 * - Check constraints for level enum and word_count >= 0
 * - Indexes on is_published, level, display_order, created_at
 * - Array columns for related_skills, recommended_for, preview_words
 * 
 * @migration Migration20251118234937
 * @created 2025-11-18
 */
export class Migration20251118234937 extends Migration {
  /**
   * Creates the topics table with all required fields, constraints, and indexes.
   */
  async up(): Promise<void> {
    // Create topics table
    this.addSql(`
      CREATE TABLE topics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL UNIQUE,
        slug VARCHAR(60) NOT NULL UNIQUE,
        icon VARCHAR(10) NOT NULL,
        description VARCHAR(300) NOT NULL,
        level VARCHAR(20) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
        word_count INTEGER NOT NULL DEFAULT 0 CHECK (word_count >= 0),
        display_order INTEGER NOT NULL DEFAULT 999,
        is_published BOOLEAN NOT NULL DEFAULT false,
        color_theme VARCHAR(7),
        related_skills TEXT[],
        recommended_for TEXT[],
        estimated_hours DECIMAL(4,1),
        preview_words TEXT[],
        banner_image_url VARCHAR(500),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create indexes for query optimization
    this.addSql(`CREATE INDEX idx_topics_published ON topics(is_published);`);
    this.addSql(`CREATE INDEX idx_topics_level ON topics(level);`);
    this.addSql(`CREATE INDEX idx_topics_display_order ON topics(display_order);`);
    this.addSql(`CREATE INDEX idx_topics_created_at ON topics(created_at DESC);`);
    this.addSql(`CREATE INDEX idx_topics_name ON topics(name);`);
  }

  /**
   * Drops the topics table and all associated indexes.
   * This is a destructive operation and should be used with caution.
   */
  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS topics CASCADE;`);
  }
}

