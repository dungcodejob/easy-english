import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';
import { v4 } from 'uuid';

/**
 * Topic entity representing a thematic vocabulary collection for English learning.
 * Each topic groups vocabulary words by real-world context (e.g., Food & Dining, Travel).
 * 
 * @entity topics
 * @example
 * ```typescript
 * const topic = new Topic();
 * topic.name = 'Food & Dining';
 * topic.slug = 'food-dining';
 * topic.icon = '🍕';
 * topic.level = 'beginner';
 * ```
 */
@Entity({ tableName: 'topics' })
export class Topic {
  /**
   * Unique identifier (UUID v4)
   */
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  /**
   * Topic display name (3-50 characters)
   * @example "Food & Dining"
   */
  @Property({ length: 50, unique: true })
  @Index()
  name!: string;

  /**
   * URL-friendly identifier (lowercase, hyphens only)
   * @example "food-dining"
   */
  @Property({ length: 60, unique: true })
  slug!: string;

  /**
   * Emoji character or icon identifier (1-10 characters)
   * @example "🍕"
   */
  @Property({ length: 10 })
  icon!: string;

  /**
   * Brief explanation of vocabulary covered (50-300 characters)
   * @example "Learn essential vocabulary for restaurants, ordering food, and dining experiences."
   */
  @Property({ length: 300 })
  description!: string;

  /**
   * Difficulty level classification
   * - beginner: A1-A2 CEFR equivalent
   * - intermediate: B1-B2 CEFR equivalent  
   * - advanced: C1-C2 CEFR equivalent
   */
  @Property({ type: 'string', length: 20 })
  @Index()
  level!: 'beginner' | 'intermediate' | 'advanced';

  /**
   * Number of vocabulary words in this topic (≥0)
   * Can be 0 for "coming soon" topics
   */
  @Property({ type: 'integer', default: 0 })
  wordCount: number = 0;

  /**
   * Custom sorting order (lower numbers appear first)
   * Default is 999 (appears at end)
   */
  @Property({ type: 'integer', default: 999 })
  @Index()
  displayOrder: number = 999;

  /**
   * Visibility to students
   * - true: visible to all authenticated students
   * - false: draft mode (admin/teacher only in future)
   */
  @Property({ type: 'boolean', default: false })
  @Index()
  isPublished: boolean = false;

  /**
   * Optional hex color code for UI theming
   * @example "#FF5733"
   */
  @Property({ length: 7, nullable: true })
  colorTheme?: string;

  /**
   * Skills that use this topic for exercises
   * @example ['reading', 'listening']
   */
  @Property({ type: 'array', nullable: true })
  relatedSkills?: string[];

  /**
   * Target user profiles or learner personas
   * @example ['travelers', 'business professionals']
   */
  @Property({ type: 'array', nullable: true })
  recommendedFor?: string[];

  /**
   * Estimated completion time in hours
   * @example 2.5
   */
  @Property({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  estimatedHours?: number;

  /**
   * 3-5 sample vocabulary words for preview
   * @example ['restaurant', 'menu', 'waiter', 'reservation', 'delicious']
   */
  @Property({ type: 'array', nullable: true })
  previewWords?: string[];

  /**
   * Optional banner image URL for topic detail page
   * @example "https://cdn.englishmaster.com/banners/food-dining.jpg"
   */
  @Property({ length: 500, nullable: true })
  bannerImageUrl?: string;

  /**
   * Creation timestamp (auto-set on entity creation)
   */
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * Last modification timestamp (auto-updated on entity update)
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

