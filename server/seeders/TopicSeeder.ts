import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Topic } from '../src/shared/entities/topic.entity';

/**
 * Seeder for vocabulary topics.
 * Creates 10 sample topics covering common learning themes.
 * 
 * @seeder TopicSeeder
 * @usage npx mikro-orm seeder:run --class TopicSeeder
 */
export class TopicSeeder extends Seeder {
  /**
   * Runs the seeder to populate topics table with sample data.
   * Idempotent: Will not create duplicates if run multiple times (checks by slug).
   * 
   * @param {EntityManager} em - MikroORM Entity Manager
   */
  async run(em: EntityManager): Promise<void> {
    const topics = [
      {
        name: 'Food & Dining',
        slug: 'food-dining',
        icon: '🍕',
        description:
          'Learn essential vocabulary for restaurants, ordering food, and dining experiences. Perfect for travelers and food enthusiasts.',
        level: 'beginner' as const,
        wordCount: 120,
        displayOrder: 1,
        isPublished: true,
        colorTheme: '#FF5733',
        relatedSkills: ['reading', 'listening'],
        recommendedFor: ['travelers', 'food enthusiasts'],
        estimatedHours: 2.5,
        previewWords: ['restaurant', 'menu', 'waiter', 'reservation', 'delicious'],
      },
      {
        name: 'Travel & Tourism',
        slug: 'travel-tourism',
        icon: '✈️',
        description:
          'Essential phrases and vocabulary for airports, hotels, directions, and tourist attractions worldwide.',
        level: 'beginner' as const,
        wordCount: 150,
        displayOrder: 2,
        isPublished: true,
        colorTheme: '#3498DB',
        relatedSkills: ['speaking', 'listening'],
        recommendedFor: ['travelers', 'tourists'],
        estimatedHours: 3.0,
        previewWords: ['airport', 'hotel', 'ticket', 'luggage', 'passport'],
      },
      {
        name: 'Business Communication',
        slug: 'business-communication',
        icon: '💼',
        description:
          'Professional vocabulary for meetings, emails, presentations, and workplace interactions.',
        level: 'intermediate' as const,
        wordCount: 200,
        displayOrder: 3,
        isPublished: true,
        colorTheme: '#2ECC71',
        relatedSkills: ['writing', 'speaking'],
        recommendedFor: ['business professionals', 'office workers'],
        estimatedHours: 4.0,
        previewWords: ['meeting', 'presentation', 'deadline', 'colleague', 'proposal'],
      },
      {
        name: 'Technology & Computing',
        slug: 'technology-computing',
        icon: '💻',
        description:
          'Modern tech vocabulary covering software, hardware, internet, and digital communication.',
        level: 'intermediate' as const,
        wordCount: 180,
        displayOrder: 4,
        isPublished: true,
        colorTheme: '#9B59B6',
        relatedSkills: ['reading', 'writing'],
        recommendedFor: ['developers', 'IT professionals', 'students'],
        estimatedHours: 3.5,
        previewWords: ['software', 'database', 'server', 'application', 'network'],
      },
      {
        name: 'Health & Medicine',
        slug: 'health-medicine',
        icon: '⚕️',
        description:
          'Medical terminology, symptoms, treatments, and healthcare conversations.',
        level: 'advanced' as const,
        wordCount: 250,
        displayOrder: 5,
        isPublished: true,
        colorTheme: '#E74C3C',
        relatedSkills: ['reading', 'listening', 'speaking'],
        recommendedFor: ['medical professionals', 'patients', 'caregivers'],
        estimatedHours: 5.0,
        previewWords: ['diagnosis', 'prescription', 'symptom', 'treatment', 'appointment'],
      },
      {
        name: 'Education & Learning',
        slug: 'education-learning',
        icon: '📚',
        description:
          'Academic vocabulary for classrooms, studying, exams, and educational discussions.',
        level: 'beginner' as const,
        wordCount: 100,
        displayOrder: 6,
        isPublished: true,
        colorTheme: '#F39C12',
        relatedSkills: ['reading', 'writing'],
        recommendedFor: ['students', 'teachers', 'parents'],
        estimatedHours: 2.0,
        previewWords: ['homework', 'exam', 'textbook', 'lecture', 'assignment'],
      },
      {
        name: 'Daily Conversation',
        slug: 'daily-conversation',
        icon: '💬',
        description:
          'Common phrases for everyday social interactions, greetings, and casual conversations.',
        level: 'beginner' as const,
        wordCount: 90,
        displayOrder: 7,
        isPublished: true,
        colorTheme: '#1ABC9C',
        relatedSkills: ['speaking', 'listening'],
        recommendedFor: ['beginners', 'travelers', 'everyday learners'],
        estimatedHours: 1.5,
        previewWords: ['hello', 'goodbye', 'thank you', 'please', 'excuse me'],
      },
      {
        name: 'Home & Family',
        slug: 'home-family',
        icon: '🏠',
        description:
          'Vocabulary for household items, family relationships, and domestic activities.',
        level: 'beginner' as const,
        wordCount: 110,
        displayOrder: 8,
        isPublished: true,
        colorTheme: '#E67E22',
        relatedSkills: ['reading', 'speaking'],
        recommendedFor: ['beginners', 'families', 'homemakers'],
        estimatedHours: 2.0,
        previewWords: ['furniture', 'kitchen', 'bedroom', 'family', 'parents'],
      },
      {
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        icon: '⚽',
        description:
          'Athletic terminology, exercise vocabulary, and sports-related conversations.',
        level: 'intermediate' as const,
        wordCount: 140,
        displayOrder: 9,
        isPublished: true,
        colorTheme: '#16A085',
        relatedSkills: ['listening', 'speaking'],
        recommendedFor: ['athletes', 'fitness enthusiasts', 'sports fans'],
        estimatedHours: 3.0,
        previewWords: ['training', 'competition', 'exercise', 'team', 'victory'],
      },
      {
        name: 'Arts & Entertainment',
        slug: 'arts-entertainment',
        icon: '🎭',
        description:
          'Cultural vocabulary for movies, music, theater, museums, and creative arts.',
        level: 'intermediate' as const,
        wordCount: 160,
        displayOrder: 10,
        isPublished: true,
        colorTheme: '#8E44AD',
        relatedSkills: ['reading', 'listening'],
        recommendedFor: ['art lovers', 'culture enthusiasts', 'creatives'],
        estimatedHours: 3.5,
        previewWords: ['concert', 'exhibition', 'performance', 'gallery', 'masterpiece'],
      },
    ];

    console.log('🌱 Seeding topics...');

    for (const topicData of topics) {
      // Check if topic already exists (idempotent seeding)
      const existingTopic = await em.findOne(Topic, { slug: topicData.slug });

      if (!existingTopic) {
        const topic = em.create(Topic, topicData);
        em.persist(topic);
        console.log(`  ✓ Created topic: ${topicData.name}`);
      } else {
        console.log(`  ⊙ Skipped (already exists): ${topicData.name}`);
      }
    }

    await em.flush();
    console.log('✅ Topic seeding completed!');
  }
}

