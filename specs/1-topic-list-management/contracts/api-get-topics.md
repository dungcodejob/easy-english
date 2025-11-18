# API Contract: GET /api/topics

**Endpoint**: `GET /api/topics`  
**Version**: 1.0.0  
**Status**: Draft  
**Last Updated**: 2025-11-18

---

## Overview

Retrieves a list of all published vocabulary topics available to authenticated users. Topics are returned with full metadata including difficulty level, word count, and optional fields for enhanced UI display.

---

## Authentication

**Required**: Yes  
**Method**: JWT Bearer Token

```http
Authorization: Bearer <jwt_token>
```

**Unauthorized Response** (401):
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "timestamp": "2025-11-18T23:30:00.000Z",
  "path": "/api/topics"
}
```

---

## Request

### HTTP Method
```
GET /api/topics
```

### Headers

| Header | Required | Value | Description |
|--------|----------|-------|-------------|
| `Authorization` | Yes | `Bearer <jwt_token>` | JWT authentication token |
| `Accept` | No | `application/json` | Response format (default: JSON) |

### Query Parameters

**None** (all filtering done client-side for better performance and UX)

### Request Example

```http
GET /api/topics HTTP/1.1
Host: api.englishmaster.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
```

---

## Response

### Success Response (200 OK)

**Status Code**: `200 OK`  
**Content-Type**: `application/json`

**Response Body**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Food & Dining",
    "slug": "food-dining",
    "icon": "🍕",
    "description": "Learn essential vocabulary for restaurants, ordering food, and dining experiences. Perfect for travelers and food enthusiasts.",
    "level": "beginner",
    "wordCount": 120,
    "displayOrder": 1,
    "colorTheme": "#FF5733",
    "relatedSkills": ["reading", "listening"],
    "recommendedFor": ["travelers", "food enthusiasts"],
    "estimatedHours": 2.5,
    "previewWords": ["restaurant", "menu", "waiter", "reservation", "delicious"],
    "bannerImageUrl": "https://cdn.englishmaster.com/banners/food-dining.jpg",
    "createdAt": "2025-11-01T10:00:00.000Z",
    "updatedAt": "2025-11-15T14:30:00.000Z"
  },
  {
    "id": "660f9511-f3ac-52e5-b827-557766551111",
    "name": "Travel & Tourism",
    "slug": "travel-tourism",
    "icon": "✈️",
    "description": "Essential phrases and vocabulary for airports, hotels, directions, and tourist attractions worldwide.",
    "level": "beginner",
    "wordCount": 150,
    "displayOrder": 2,
    "colorTheme": "#3498DB",
    "relatedSkills": ["speaking", "listening"],
    "recommendedFor": ["travelers", "tourists"],
    "estimatedHours": 3.0,
    "previewWords": ["airport", "hotel", "ticket", "luggage", "passport"],
    "bannerImageUrl": null,
    "createdAt": "2025-11-01T10:05:00.000Z",
    "updatedAt": "2025-11-15T14:35:00.000Z"
  }
]
```

### Response Schema

**Array of Topic Objects**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | Yes | Unique topic identifier |
| `name` | string | Yes | Topic display name (3-50 chars) |
| `slug` | string | Yes | URL-friendly identifier |
| `icon` | string | Yes | Emoji or icon identifier (1-10 chars) |
| `description` | string | Yes | Topic description (50-300 chars) |
| `level` | enum | Yes | Difficulty: `beginner`, `intermediate`, `advanced` |
| `wordCount` | integer | Yes | Number of words in topic (≥0) |
| `displayOrder` | integer | Yes | Custom sort order |
| `colorTheme` | string \| null | No | Hex color code (e.g., "#FF5733") |
| `relatedSkills` | string[] \| null | No | Skills: `reading`, `writing`, `listening`, `speaking` |
| `recommendedFor` | string[] \| null | No | Target user profiles |
| `estimatedHours` | number \| null | No | Estimated completion time |
| `previewWords` | string[] \| null | No | 3-5 sample vocabulary words |
| `bannerImageUrl` | string \| null | No | Optional banner image URL |
| `createdAt` | string (ISO 8601) | Yes | Creation timestamp |
| `updatedAt` | string (ISO 8601) | Yes | Last update timestamp |

### Empty Response

When no topics are published:

```json
[]
```

**HTTP Status**: `200 OK` (empty array, not 404)

---

## Error Responses

### 401 Unauthorized

**Condition**: Missing or invalid JWT token

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "timestamp": "2025-11-18T23:30:00.000Z",
  "path": "/api/topics"
}
```

### 429 Too Many Requests

**Condition**: Rate limit exceeded (>60 requests/minute)

```json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "timestamp": "2025-11-18T23:30:00.000Z",
  "path": "/api/topics"
}
```

**Headers**:
```
Retry-After: 60
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1700343600
```

### 500 Internal Server Error

**Condition**: Server error, database connection failure

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "timestamp": "2025-11-18T23:30:00.000Z",
  "path": "/api/topics"
}
```

---

## Business Rules

### Visibility Rules

1. **Published Topics Only**: Only topics with `is_published = true` are returned
2. **Student Access**: All authenticated students can access this endpoint
3. **No Filtering**: Backend returns all published topics; filtering done client-side

### Sorting Rules

1. **Primary Sort**: `displayOrder` (ascending)
2. **Secondary Sort**: `name` (alphabetical A-Z)
3. Topics with same `displayOrder` are alphabetized

### Data Rules

1. **Word Count Zero**: Topics with 0 words are valid ("coming soon" topics)
2. **Optional Fields**: Null values allowed for optional fields
3. **Icon Format**: Emoji characters (Unicode) or icon library identifiers

---

## Performance Characteristics

### Response Time

- **Target**: P95 < 200ms
- **Typical**: 50-100ms
- **Factors**: Database query, serialization, network

### Caching

**Server-Side**:
- TypeORM query cache: 5 minutes
- HTTP Cache-Control header: `public, max-age=300`

**Client-Side**:
- TanStack Query staleTime: 5 minutes
- Aggressive caching acceptable (topics rarely change)

### Data Volume

- **Typical**: 10-50 topics (~15KB response gzipped)
- **Maximum**: 1,000 topics (~300KB response gzipped)
- **Pagination**: Not needed for MVP; consider if topics exceed 100

---

## Rate Limiting

**Limit**: 60 requests per minute per user (JWT token)

**Headers** (included in all responses):
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1700343600
```

**Enforcement**: Token bucket algorithm, keyed by user ID from JWT

---

## Security Considerations

### Authentication

- JWT token validated on every request
- Token must not be expired
- Token signature verified against secret key

### Authorization

- No additional role checks (all authenticated users can view topics)
- Future: Teachers/admins may see unpublished topics

### Data Protection

- No PII (Personally Identifiable Information) in response
- No sensitive data exposed
- CORS configured to allow only trusted origins

---

## OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: EnglishMaster API
  version: 1.0.0

paths:
  /api/topics:
    get:
      summary: Get all published vocabulary topics
      description: Retrieves a list of all published topics available to authenticated students
      tags:
        - Topics
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Topic'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '429':
          description: Too Many Requests
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Topic:
      type: object
      required:
        - id
        - name
        - slug
        - icon
        - description
        - level
        - wordCount
        - displayOrder
        - createdAt
        - updatedAt
      properties:
        id:
          type: string
          format: uuid
          example: '550e8400-e29b-41d4-a716-446655440000'
        name:
          type: string
          minLength: 3
          maxLength: 50
          example: 'Food & Dining'
        slug:
          type: string
          pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
          example: 'food-dining'
        icon:
          type: string
          minLength: 1
          maxLength: 10
          example: '🍕'
        description:
          type: string
          minLength: 50
          maxLength: 300
          example: 'Learn essential vocabulary for restaurants, ordering food, and dining experiences.'
        level:
          type: string
          enum: [beginner, intermediate, advanced]
          example: 'beginner'
        wordCount:
          type: integer
          minimum: 0
          example: 120
        displayOrder:
          type: integer
          example: 1
        colorTheme:
          type: string
          nullable: true
          pattern: '^#[0-9A-Fa-f]{6}$'
          example: '#FF5733'
        relatedSkills:
          type: array
          nullable: true
          items:
            type: string
            enum: [reading, writing, listening, speaking]
          example: ['reading', 'listening']
        recommendedFor:
          type: array
          nullable: true
          items:
            type: string
          example: ['travelers', 'food enthusiasts']
        estimatedHours:
          type: number
          nullable: true
          minimum: 0
          example: 2.5
        previewWords:
          type: array
          nullable: true
          items:
            type: string
          example: ['restaurant', 'menu', 'waiter']
        bannerImageUrl:
          type: string
          nullable: true
          format: uri
          example: 'https://cdn.englishmaster.com/banners/food-dining.jpg'
        createdAt:
          type: string
          format: date-time
          example: '2025-11-01T10:00:00.000Z'
        updatedAt:
          type: string
          format: date-time
          example: '2025-11-15T14:30:00.000Z'

    Error:
      type: object
      required:
        - statusCode
        - message
        - timestamp
        - path
      properties:
        statusCode:
          type: integer
          example: 401
        message:
          type: string
          example: 'Unauthorized'
        timestamp:
          type: string
          format: date-time
          example: '2025-11-18T23:30:00.000Z'
        path:
          type: string
          example: '/api/topics'
```

---

## Testing Requirements

### Unit Tests

- Controller method returns all published topics
- Service filters by `is_published = true`
- Repository sorts by `displayOrder`, then `name`

### Integration Tests

```typescript
describe('GET /api/topics', () => {
  it('should return 200 and list of published topics', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/topics')
      .set('Authorization', `Bearer ${validJwt}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('level');
  });

  it('should return 401 without JWT', async () => {
    await request(app.getHttpServer())
      .get('/api/topics')
      .expect(401);
  });

  it('should return 429 after rate limit exceeded', async () => {
    // Make 61 requests rapidly
    for (let i = 0; i < 61; i++) {
      await request(app.getHttpServer())
        .get('/api/topics')
        .set('Authorization', `Bearer ${validJwt}`);
    }

    await request(app.getHttpServer())
      .get('/api/topics')
      .set('Authorization', `Bearer ${validJwt}`)
      .expect(429);
  });
});
```

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-18 | Initial API contract definition |

---

## Future Considerations

### Potential Enhancements

1. **Query Parameters** (if topics exceed 100):
   - `?level=beginner` - Filter by level backend-side
   - `?page=1&limit=20` - Pagination support
   - `?search=food` - Backend search (currently client-side)

2. **Response Headers**:
   - `X-Total-Count` - Total published topics
   - `Link` - Pagination links (rel=next, rel=prev)

3. **Conditional Requests**:
   - `If-None-Match` (ETag) for cache validation
   - `If-Modified-Since` for incremental updates

4. **Additional Endpoints**:
   - `GET /api/topics/:slug` - Get single topic by slug
   - `GET /api/topics/:id` - Get single topic by ID

---

**End of API Contract**

