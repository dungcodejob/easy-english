import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for Topic entity.
 * Represents a vocabulary topic with all its metadata.
 * 
 * @dto TopicResponseDto
 * @example
 * ```json
 * {
 *   "id": "550e8400-e29b-41d4-a716-446655440000",
 *   "name": "Food & Dining",
 *   "slug": "food-dining",
 *   "icon": "🍕",
 *   "description": "Learn essential vocabulary for restaurants...",
 *   "level": "beginner",
 *   "wordCount": 120,
 *   "displayOrder": 1,
 *   "colorTheme": "#FF5733",
 *   "relatedSkills": ["reading", "listening"],
 *   "recommendedFor": ["travelers", "food enthusiasts"],
 *   "estimatedHours": 2.5,
 *   "previewWords": ["restaurant", "menu", "waiter"],
 *   "bannerImageUrl": "https://cdn.example.com/banners/food.jpg",
 *   "createdAt": "2025-11-01T10:00:00.000Z",
 *   "updatedAt": "2025-11-15T14:30:00.000Z"
 * }
 * ```
 */
export class TopicResponseDto {
  @ApiProperty({
    description: 'Unique identifier (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Topic display name',
    example: 'Food & Dining',
    minLength: 3,
    maxLength: 50,
  })
  name: string;

  @ApiProperty({
    description: 'URL-friendly identifier',
    example: 'food-dining',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
  })
  slug: string;

  @ApiProperty({
    description: 'Emoji or icon identifier',
    example: '🍕',
    minLength: 1,
    maxLength: 10,
  })
  icon: string;

  @ApiProperty({
    description: 'Brief explanation of vocabulary covered',
    example:
      'Learn essential vocabulary for restaurants, ordering food, and dining experiences.',
    minLength: 50,
    maxLength: 300,
  })
  description: string;

  @ApiProperty({
    description: 'Difficulty level',
    enum: ['beginner', 'intermediate', 'advanced'],
    example: 'beginner',
  })
  level: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({
    description: 'Number of vocabulary words in topic',
    example: 120,
    minimum: 0,
  })
  wordCount: number;

  @ApiProperty({
    description: 'Custom sorting order (lower = earlier)',
    example: 1,
  })
  displayOrder: number;

  @ApiProperty({
    description: 'Hex color code for UI theming',
    example: '#FF5733',
    required: false,
    pattern: '^#[0-9A-Fa-f]{6}$',
  })
  colorTheme?: string;

  @ApiProperty({
    description: 'Skills that use this topic',
    example: ['reading', 'listening'],
    required: false,
    type: [String],
  })
  relatedSkills?: string[];

  @ApiProperty({
    description: 'Target user profiles',
    example: ['travelers', 'food enthusiasts'],
    required: false,
    type: [String],
  })
  recommendedFor?: string[];

  @ApiProperty({
    description: 'Estimated completion time in hours',
    example: 2.5,
    required: false,
    minimum: 0,
  })
  estimatedHours?: number;

  @ApiProperty({
    description: '3-5 sample vocabulary words',
    example: ['restaurant', 'menu', 'waiter', 'reservation', 'delicious'],
    required: false,
    type: [String],
  })
  previewWords?: string[];

  @ApiProperty({
    description: 'Optional banner image URL',
    example: 'https://cdn.englishmaster.com/banners/food-dining.jpg',
    required: false,
  })
  bannerImageUrl?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-11-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last modification timestamp',
    example: '2025-11-15T14:30:00.000Z',
  })
  updatedAt: Date;
}

