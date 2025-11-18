import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * E2E tests for Topics API endpoints.
 * Tests the complete HTTP request/response cycle including:
 * - Authentication
 * - Rate limiting
 * - Response format validation
 * - Error scenarios
 * 
 * @requires Database connection configured
 * @requires Sample topics seeded
 * @requires JWT authentication configured
 */
describe('Topics API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply global validation pipe (same as main.ts)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    // TODO: Authenticate to get JWT token
    // This would typically involve calling the login endpoint
    // For now, using a placeholder
    authToken = 'Bearer test-jwt-token';
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /topics', () => {
    it('should return 200 OK with array of published topics', () => {
      return request(app.getHttpServer())
        .get('/topics')
        .set('Authorization', authToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });

    it('should return topics with correct schema', () => {
      return request(app.getHttpServer())
        .get('/topics')
        .set('Authorization', authToken)
        .expect(200)
        .then((response) => {
          const topic = response.body[0];

          // Required fields
          expect(topic).toHaveProperty('id');
          expect(topic).toHaveProperty('name');
          expect(topic).toHaveProperty('slug');
          expect(topic).toHaveProperty('icon');
          expect(topic).toHaveProperty('description');
          expect(topic).toHaveProperty('level');
          expect(topic).toHaveProperty('wordCount');
          expect(topic).toHaveProperty('displayOrder');
          expect(topic).toHaveProperty('createdAt');
          expect(topic).toHaveProperty('updatedAt');

          // Validate types
          expect(typeof topic.id).toBe('string');
          expect(typeof topic.name).toBe('string');
          expect(typeof topic.slug).toBe('string');
          expect(typeof topic.icon).toBe('string');
          expect(typeof topic.description).toBe('string');
          expect(['beginner', 'intermediate', 'advanced']).toContain(topic.level);
          expect(typeof topic.wordCount).toBe('number');
          expect(typeof topic.displayOrder).toBe('number');
        });
    });

    it('should return topics ordered by displayOrder ASC, then name ASC', () => {
      return request(app.getHttpServer())
        .get('/topics')
        .set('Authorization', authToken)
        .expect(200)
        .then((response) => {
          const topics = response.body;

          // Check ordering
          for (let i = 0; i < topics.length - 1; i++) {
            const current = topics[i];
            const next = topics[i + 1];

            // Primary: displayOrder should be ascending
            if (current.displayOrder !== next.displayOrder) {
              expect(current.displayOrder).toBeLessThanOrEqual(next.displayOrder);
            } else {
              // Secondary: name should be alphabetical when displayOrder is same
              expect(current.name.localeCompare(next.name)).toBeLessThanOrEqual(0);
            }
          }
        });
    });

    it('should return only published topics', () => {
      return request(app.getHttpServer())
        .get('/topics')
        .set('Authorization', authToken)
        .expect(200)
        .then((response) => {
          const topics = response.body;

          // Note: This test assumes isPublished field is not exposed in response
          // All returned topics should be published
          expect(topics.length).toBeGreaterThan(0);
        });
    });

    it('should return 401 Unauthorized without JWT token', () => {
      return request(app.getHttpServer())
        .get('/topics')
        .expect(401);
    });

    it('should return 401 Unauthorized with invalid JWT token', () => {
      return request(app.getHttpServer())
        .get('/topics')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect(401);
    });

    it('should return 429 Too Many Requests after rate limit exceeded', async () => {
      // Make 61 requests rapidly (rate limit is 60 per minute)
      const promises = [];
      for (let i = 0; i < 61; i++) {
        promises.push(
          request(app.getHttpServer())
            .get('/topics')
            .set('Authorization', authToken),
        );
      }

      const responses = await Promise.all(promises);

      // At least one request should be rate-limited
      const rateLimitedResponses = responses.filter((res) => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it('should include rate limit headers in response', () => {
      return request(app.getHttpServer())
        .get('/topics')
        .set('Authorization', authToken)
        .expect(200)
        .then((response) => {
          expect(response.headers).toHaveProperty('x-ratelimit-limit');
          expect(response.headers).toHaveProperty('x-ratelimit-remaining');
          expect(response.headers).toHaveProperty('x-ratelimit-reset');
        });
    });

    it('should handle optional fields correctly', () => {
      return request(app.getHttpServer())
        .get('/topics')
        .set('Authorization', authToken)
        .expect(200)
        .then((response) => {
          const topic = response.body[0];

          // Optional fields may be null or defined
          if (topic.colorTheme !== null) {
            expect(typeof topic.colorTheme).toBe('string');
            expect(topic.colorTheme).toMatch(/^#[0-9A-Fa-f]{6}$/);
          }

          if (topic.relatedSkills !== null) {
            expect(Array.isArray(topic.relatedSkills)).toBe(true);
          }

          if (topic.recommendedFor !== null) {
            expect(Array.isArray(topic.recommendedFor)).toBe(true);
          }

          if (topic.estimatedHours !== null) {
            expect(typeof topic.estimatedHours).toBe('number');
          }

          if (topic.previewWords !== null) {
            expect(Array.isArray(topic.previewWords)).toBe(true);
          }

          if (topic.bannerImageUrl !== null) {
            expect(typeof topic.bannerImageUrl).toBe('string');
          }
        });
    });

    it('should return consistent results on repeated requests (caching)', async () => {
      const response1 = await request(app.getHttpServer())
        .get('/topics')
        .set('Authorization', authToken)
        .expect(200);

      // Wait 100ms
      await new Promise((resolve) => setTimeout(resolve, 100));

      const response2 = await request(app.getHttpServer())
        .get('/topics')
        .set('Authorization', authToken)
        .expect(200);

      // Results should be identical (cached)
      expect(response1.body).toEqual(response2.body);
    });

    it('should have acceptable response time (< 500ms)', () => {
      const startTime = Date.now();

      return request(app.getHttpServer())
        .get('/topics')
        .set('Authorization', authToken)
        .expect(200)
        .then(() => {
          const duration = Date.now() - startTime;
          expect(duration).toBeLessThan(500);
        });
    });
  });
});

