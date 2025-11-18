import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { TopicsService } from './topics.service';
import { TopicResponseDto } from './dto';

/**
 * Controller for vocabulary topics endpoints.
 * Handles HTTP requests for topic management.
 * 
 * @controller topics
 * @authentication JWT Bearer Token required
 * @rateLimit 60 requests per minute
 */
@ApiTags('topics')
@Controller('topics')
@UseGuards(ThrottlerGuard)
@ApiBearerAuth()
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  /**
   * Get all published vocabulary topics.
   * Returns topics ordered by display order and name.
   * 
   * @endpoint GET /api/topics
   * @authentication Required (JWT)
   * @rateLimit 60 requests per 60 seconds
   * 
   * @returns {Promise<TopicResponseDto[]>} Array of published topics
   * 
   * @throws {401} Unauthorized - Invalid or missing JWT token
   * @throws {429} Too Many Requests - Rate limit exceeded
   * @throws {500} Internal Server Error - Database or server error
   * 
   * @example
   * ```bash
   * curl -H "Authorization: Bearer <token>" \
   *      http://localhost:3000/api/topics
   * ```
   */
  @Get()
  @Throttle({ default: { limit: 60, ttl: 60000 } }) // 60 requests per 60 seconds
  @ApiOperation({
    summary: 'Get all published vocabulary topics',
    description:
      'Retrieves a list of all published topics available to authenticated students. ' +
      'Topics are returned ordered by display order (ascending) and name (alphabetical). ' +
      'Results are cached for 5 minutes for optimal performance.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response with list of published topics',
    type: [TopicResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests - Rate limit exceeded (60 req/min)',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Database or server error',
  })
  async findAll(): Promise<TopicResponseDto[]> {
    return this.topicsService.findAllPublished();
  }
}

