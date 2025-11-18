<!--
Sync Impact Report:
Version: 1.0.0 → 2.0.0
Rationale: MAJOR version bump - Complete frontend stack migration from Angular to React
Modified Principles:
  - Principle 1: Technology Stack Integrity (Angular → React, NgRx → Zustand + TanStack Query)
  - Principle 2: Modular Architecture (Angular modules → React feature folders)
  - Principle 4: Comprehensive Validation (Angular Reactive Forms → React Hook Form + Zod)
  - Principle 7: Error Handling (Angular HttpInterceptor → Axios interceptors)
  - Principle 8: Testing Discipline (Angular Testing Library → React Testing Library)
  - Principle 9: Performance & Scalability (Angular OnPush → React.memo, TanStack Router lazy loading)
  - Principle 10: Documentation (Updated Context7 references from Angular to React)
Added Sections: None
Removed Sections: None
Templates Status:
  ⚠ .specify/templates/plan-template.md - PENDING (needs update for React stack)
  ⚠ .specify/templates/spec-template.md - PENDING (needs update for React stack)
  ⚠ .specify/templates/tasks-template.md - PENDING (needs update for React stack)
  ⚠ .specify/templates/commands/*.md - PENDING (to be created)
  ⚠ README.md - NEEDS UPDATE (references Angular in multiple places)
Follow-up TODOs:
  - Update README.md Technology Stack section
  - Create template files aligned with React constitution
  - Update any Angular-specific documentation
  - Review existing code for constitutional compliance
-->

# EnglishMaster Project Constitution

**Version**: 2.0.0  
**Ratification Date**: 2025-11-17  
**Last Amended**: 2025-11-18  
**Status**: Active

## Purpose

This constitution establishes the governing principles for **EnglishMaster**, a full-stack English learning application designed to help users master the four core language skills: Reading, Writing, Speaking, and Listening. All code, architecture decisions, and feature implementations MUST comply with the principles herein.

## Technology Foundation

- **Frontend**: React v19+ with TypeScript strict mode
- **UI Library**: Shadcn UI (Radix UI primitives + Tailwind CSS)
- **Routing**: TanStack Router with file-based routing and auto code splitting
- **State Management**: Zustand for client state, TanStack Query for server state
- **Form Management**: React Hook Form with Zod validation
- **Build Tool**: Rsbuild (Rspack-based) for fast builds
- **Package Manager**: Bun for fast dependency management
- **Backend**: NestJS with TypeScript strict mode
- **Database**: PostgreSQL v14+
- **Authentication**: JWT with refresh token rotation
- **API**: RESTful with OpenAPI/Swagger documentation
- **Linting/Formatting**: Biome for unified code quality
- **Documentation**: Context7 integration for AI-assisted development

## Core Principles

### Principle 1: Technology Stack Integrity

**Declaration**: The project SHALL maintain a consistent, modern technology stack as defined in this constitution. No framework substitutions or competing patterns SHALL be introduced without constitutional amendment.

**Rules**:
- React v19+ MUST be used for all frontend development; no alternative frameworks (Vue, Svelte, Angular) are permitted
- Shadcn UI MUST be the primary UI component library; no competing UI libraries (Material-UI, Ant Design, Chakra) without justification
- TanStack Router MUST be used for all routing; no React Router or alternative routers
- Zustand MUST be used for client state; TanStack Query MUST be used for server state; no Redux, MobX, or Jotai
- React Hook Form + Zod MUST be used for all forms; no Formik or other form libraries
- Rsbuild MUST be the build tool; no Vite, Webpack, or custom build configurations
- Bun MUST be the package manager; no npm or yarn (except for compatibility tooling)
- NestJS MUST be used for all backend API endpoints; no Express-only routes allowed
- PostgreSQL MUST be the sole relational database; no MongoDB, MySQL, or other databases without amendment
- All dependencies MUST be kept within one major version of latest stable release unless justified by breaking changes
- Package updates MUST be reviewed quarterly and applied unless incompatibility risks identified

**Rationale**: Consistency prevents architectural drift, simplifies onboarding, and ensures Context7 can provide accurate, stack-specific guidance. Mixing frameworks creates maintenance burden and dilutes expertise. The React ecosystem offers mature tooling and extensive community support.

---

### Principle 2: Modular Architecture

**Declaration**: The codebase SHALL be organized into strict, loosely-coupled feature modules with clear boundaries, lazy loading, and minimal inter-feature dependencies.

**Rules**:
- Frontend MUST organize features as self-contained folders: `features/reading/`, `features/writing/`, `features/speaking/`, `features/listening/`
- Each feature folder MUST contain:
  - `components/` - Feature-specific React components
  - `pages/` - Route components (exported for TanStack Router)
  - `hooks/` - Feature-specific custom hooks
  - `services/` - API client functions (using Axios)
  - `stores/` - Zustand stores for feature state
  - `types/` - TypeScript interfaces and types
  - `index.ts` - Barrel export for public API
- Backend MUST organize features as NestJS modules with dedicated controllers, services, repositories, and DTOs
- Each feature MUST be lazy-loaded on the frontend (TanStack Router's auto code splitting via route tree)
- Cross-feature communication MUST occur through:
  - **Frontend**: Zustand stores (global state), TanStack Query (server state), custom events, or context providers
  - **Backend**: Dependency injection, event emitters, or message queue for async communication
- A feature SHALL NOT directly import internal components/services from another feature (use public APIs via barrel exports from `index.ts`)
- Shared code MUST reside in `client/src/components/`, `client/src/hooks/`, or `backend/src/common/` with explicit exports

**Rationale**: Modularity enables independent development, testing, and deployment of features. TanStack Router's auto code splitting improves initial load time. Clear boundaries reduce coupling and make refactoring safer. Feature folders provide better discoverability than Angular's decorator-based modules.

---

### Principle 3: Type Safety First

**Declaration**: TypeScript strict mode MUST be enforced across the entire codebase. The `any` type is prohibited except in narrowly justified legacy integration scenarios.

**Rules**:
- `tsconfig.json` MUST enable: `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, `strictFunctionTypes: true`
- The `any` type SHALL NOT appear in production code except:
  - Third-party library type definitions that cannot be amended (must be documented with `// @ts-expect-error` and rationale)
  - Type assertions MUST use `as Type` syntax, never angle-bracket `<Type>` (conflicts with JSX)
- All function parameters, return types, and class properties MUST have explicit types
- DTOs (Data Transfer Objects) MUST use `class-validator` decorators for runtime validation
- Database entities MUST use TypeORM decorators with explicit column types
- API responses MUST be typed with interfaces matching OpenAPI schema definitions
- Generic types MUST be used where applicable to maximize reusability (`Array<T>`, `Promise<T>`, custom generics)

**Rationale**: Type safety catches errors at compile time, improves IDE autocomplete, and serves as living documentation. Strict mode eliminates entire classes of runtime errors.

---

### Principle 4: Comprehensive Validation

**Declaration**: All data entering the system MUST be validated at multiple layers to ensure data integrity, security, and UX quality.

**Rules**:
- **Frontend Validation** (React Hook Form + Zod):
  - All forms MUST use React Hook Form with Zod schema validation
  - Zod schemas MUST define: required fields, min/max length, pattern matching, email format, custom refinements
  - Example schema structure:
    ```typescript
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8).max(100),
      wordCount: z.number().min(100).max(1000)
    });
    ```
  - Real-time validation feedback MUST be displayed using `formState.errors`
  - Form submission MUST be prevented until all validations pass (`formState.isValid`)
  - Validation errors MUST be displayed inline with form fields
- **Backend Validation** (NestJS):
  - All incoming DTOs MUST use `class-validator` decorators (`@IsString()`, `@IsEmail()`, `@Min()`, `@Max()`, etc.)
  - Global validation pipe MUST be enabled: `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))`
  - Custom validators MUST be created for business logic constraints (e.g., essay word count 100-1000)
- **Database Validation** (PostgreSQL):
  - Constraints MUST be defined: `NOT NULL`, `UNIQUE`, `CHECK`, foreign keys
  - Enums MUST be used for fixed-value columns (difficulty levels: A1, A2, B1, B2, C1, C2)
- **File Uploads**:
  - Audio files (speaking module) MUST validate: file type (`.mp3`, `.wav`, `.m4a`), max size (10MB), duration (≤5 minutes)
  - File uploads MUST use streaming validation, not buffering entire file in memory

**Rationale**: Multi-layer validation provides defense in depth. React Hook Form + Zod provides type-safe validation with excellent DX. Frontend validation improves UX; backend validation prevents malicious requests; database validation ensures data integrity.

---

### Principle 5: Secure Authentication & Authorization

**Declaration**: The application MUST implement robust JWT-based authentication with role-based access control (RBAC) and security hardening.

**Rules**:
- **Authentication**:
  - JWT access tokens MUST expire within 15 minutes
  - Refresh tokens MUST expire within 7 days and support rotation
  - Passwords MUST be hashed using bcrypt with minimum cost factor of 12
  - Login attempts MUST be rate-limited (5 attempts per 15 minutes per IP)
  - Password reset MUST use single-use tokens with 1-hour expiration
- **Authorization**:
  - Three roles MUST be supported: `STUDENT`, `TEACHER`, `ADMIN`
  - Route guards MUST protect frontend routes based on role
  - Backend endpoints MUST use `@UseGuards(JwtAuthGuard, RolesGuard)` decorators
  - Teachers can create/edit content; students can view/submit; admins can manage users
- **Security Headers**:
  - CORS MUST be configured to allow only trusted origins
  - Helmet.js MUST be enabled for security headers (CSP, X-Frame-Options, etc.)
  - CSRF protection MUST be implemented for state-changing operations
- **Sensitive Data**:
  - Database connection strings, JWT secrets MUST be stored in environment variables, never hardcoded
  - `.env` files MUST NOT be committed to version control (`.gitignore` enforcement)

**Rationale**: Security is non-negotiable. Short-lived tokens minimize risk of token theft. RBAC ensures users can only access authorized resources. Hardening prevents common web vulnerabilities.

---

### Principle 6: Four Skills Implementation Standards

**Declaration**: The Reading, Writing, Speaking, and Listening modules MUST follow consistent implementation patterns to ensure maintainability and user experience uniformity.

**Rules**:
- **Module Structure** (each feature MUST include):
  - **Frontend**: 
    - `features/[skill]/pages/` - Route components (`[Skill]ListPage`, `[Skill]DetailPage`)
    - `features/[skill]/components/` - Feature components (`[Skill]Card`, `[Skill]Form`, etc.)
    - `features/[skill]/hooks/` - Custom hooks (`use[Skill]s`, `use[Skill]ById`, `useCreate[Skill]`)
    - `features/[skill]/services/` - API functions (`[skill].api.ts`)
    - `features/[skill]/stores/` - Zustand stores (`[skill].store.ts`)
    - `features/[skill]/types/` - TypeScript types and interfaces
  - **Backend**: `[Skill]Module`, `[Skill]Controller`, `[Skill]Service`, `[Skill]Repository`, DTOs, entities
- **Common Features** (all modules MUST implement):
  - Progress tracking with percentage complete
  - Difficulty level filtering (A1-C2 for reading/listening; beginner/intermediate/advanced for writing/speaking)
  - History/archive of completed exercises
  - Feedback/results display after submission
  - Responsive design using Tailwind CSS utilities
  - Loading states with Skeleton components (Shadcn UI)
  - Error states with proper error boundaries
- **Reading Module**:
  - Articles MUST support inline vocabulary tooltips using Radix UI Tooltip (hover/click to reveal definition)
  - Quizzes MUST support multiple choice, fill-in-the-blank, and true/false questions
  - Minimum 1 article per difficulty level at launch
  - Use Shadcn UI Card and Badge components for article presentation
- **Writing Module**:
  - Rich text editor MUST support basic formatting (bold, italic, lists, links)
  - Word count MUST be displayed in real-time using React state
  - Basic grammar feedback MUST flag common errors (e.g., repeated words, missing capitalization)
  - Submissions MUST be saved as drafts automatically every 30 seconds using TanStack Query mutations
  - Use Shadcn UI Textarea or integrate a rich text editor (e.g., Tiptap)
- **Speaking Module**:
  - Audio recording MUST use Web Audio API or MediaRecorder API
  - Waveform visualization MUST be displayed during recording/playback
  - Reference audio MUST be provided for comparison using HTML5 Audio
  - Speech-to-text transcription MUST be displayed (can use external API initially)
  - Use Shadcn UI Button components for recording controls
- **Listening Module**:
  - Audio player MUST support playback speed control (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
  - Transcript MUST be revealable using Shadcn UI Collapsible (hidden by default to test comprehension)
  - Questions MUST be answerable only after audio completes or user confirms listening
  - Use Shadcn UI RadioGroup for multiple-choice questions

**Rationale**: Consistent patterns reduce cognitive load for users and developers. Shared abstractions enable code reuse. Feature parity ensures no skill module feels neglected. React's component model and Shadcn UI provide reusable, accessible primitives.

---

### Principle 7: Error Handling & Observability

**Declaration**: The application MUST handle errors gracefully with structured logging, user-friendly messages, and monitoring capabilities.

**Rules**:
- **Frontend Error Handling**:
  - Error Boundaries MUST wrap route components to catch React rendering errors
  - Axios interceptors MUST handle HTTP errors consistently:
    - `401 Unauthorized` → clear tokens, redirect to login via TanStack Router
    - `403 Forbidden` → show "Access Denied" message via toast
    - `404 Not Found` → show "Resource not found" message
    - `500 Server Error` → show "Something went wrong, please try again" with option to report
  - TanStack Query error handling MUST use `onError` callbacks or `useErrorBoundary` option
  - Toast notifications MUST use Sonner (from Shadcn UI) to inform users of success/error states
  - Example error interceptor structure:
    ```typescript
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear auth state and redirect
        }
        return Promise.reject(error);
      }
    );
    ```
- **Backend Error Handling**:
  - Custom exception filters MUST format errors consistently: `{ statusCode, message, timestamp, path }`
  - Business logic errors MUST use custom exceptions (`ArticleNotFoundException`, `InvalidQuizAnswerException`)
  - Validation errors MUST return field-specific messages: `{ field: 'email', message: 'must be a valid email' }`
  - Unhandled exceptions MUST be caught by global exception filter and logged
- **Logging**:
  - NestJS Logger MUST be used for all logging (no `console.log` in production code)
  - Log levels MUST follow convention: `error` (exceptions), `warn` (recoverable issues), `log` (significant events), `debug` (development only)
  - Logs MUST include correlation IDs for request tracing
  - Sensitive data (passwords, tokens) MUST NOT be logged
- **Observability**:
  - Health check endpoint MUST be implemented: `GET /health` (checks DB connection, memory usage)
  - Metrics MUST be exposed for: request count, response time, error rate
  - Application MUST integrate with a logging service (e.g., Winston + file transport, or cloud logging)

**Rationale**: Graceful error handling prevents user frustration. React Error Boundaries catch component errors; Axios interceptors handle network errors. Sonner provides excellent toast UX. Structured logging enables rapid debugging. Observability ensures production issues are detectable and diagnosable.

---

### Principle 8: Testing Discipline

**Declaration**: All code MUST be accompanied by automated tests achieving ≥80% code coverage, with a balance of unit, integration, and end-to-end tests.

**Rules**:
- **Frontend Testing** (Vitest + React Testing Library):
  - Component logic MUST have unit tests (≥80% coverage per component)
  - Tests MUST use React Testing Library's user-centric queries (`getByRole`, `getByLabelText`, not `getByTestId` unless necessary)
  - Custom hooks MUST be tested using `@testing-library/react-hooks` or by rendering a test component
  - Zustand stores MUST have tests for all state mutations and actions
  - TanStack Query hooks MUST be tested with mocked API responses using `axios-mock-adapter` or MSW
  - Critical user flows MUST have E2E tests using Playwright (login, article reading, quiz submission, audio recording)
  - Example test structure:
    ```typescript
    describe('LoginForm', () => {
      it('should display validation errors for invalid email', async () => {
        render(<LoginForm />);
        const emailInput = screen.getByLabelText(/email/i);
        await userEvent.type(emailInput, 'invalid-email');
        await userEvent.tab();
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });
    ```
- **Backend Testing** (Jest + Supertest):
  - Service methods MUST have unit tests with mocked repositories
  - Controllers MUST have integration tests with real database (test database or in-memory PostgreSQL)
  - DTOs MUST be tested for validation rules
  - Authentication guards MUST be tested for authorized/unauthorized scenarios
  - Database repositories MUST be tested for CRUD operations
- **Test Quality**:
  - Tests MUST follow AAA pattern: Arrange, Act, Assert
  - Tests MUST be deterministic (no flaky tests due to timing or randomness)
  - Tests MUST NOT depend on external services (use mocks/stubs/MSW)
  - Test data MUST be seeded consistently (factories or fixtures)
  - Accessibility MUST be tested using `jest-axe` or Playwright's accessibility assertions
- **Coverage Enforcement**:
  - CI/CD pipeline MUST fail builds if coverage drops below 80%
  - Coverage reports MUST be generated and reviewed in pull requests
  - Untested code MUST be justified with a comment and tracked for future testing

**Rationale**: High test coverage catches regressions early, enables confident refactoring, and serves as executable documentation. React Testing Library promotes testing user behavior over implementation details. Playwright provides reliable E2E testing with excellent developer experience.

---

### Principle 9: Performance & Scalability

**Declaration**: The application MUST be optimized for performance and designed to scale horizontally as user base grows.

**Rules**:
- **Frontend Performance**:
  - Lazy loading MUST be used for all features (TanStack Router auto code splitting via route tree)
  - React components MUST be optimized:
    - Use `React.memo()` for pure presentational components to prevent unnecessary re-renders
    - Use `useMemo()` for expensive computations
    - Use `useCallback()` for callback props passed to child components
  - Images MUST be optimized (WebP format, lazy loading with `loading="lazy"`, responsive images with `srcset`)
  - Large lists MUST use virtual scrolling (e.g., `@tanstack/react-virtual` for article lists)
  - Bundle size MUST be monitored using Rsbuild's bundle analyzer; initial bundle ≤500KB gzipped
  - Heavy dependencies MUST be lazy-loaded (e.g., chart libraries, rich text editors)
  - Tailwind CSS MUST be configured to purge unused styles in production
- **Backend Performance**:
  - Database queries MUST be optimized with indexes on frequently queried columns (user_id, skill_type, difficulty)
  - N+1 query problems MUST be avoided (use eager loading with TypeORM relations)
  - Expensive operations (audio transcription, essay feedback) MUST be processed asynchronously (job queue like Bull)
  - Response times MUST be monitored; P95 latency ≤500ms for API endpoints
- **Caching**:
  - Static content (articles, reference audio) MUST be cached with appropriate TTL (1 hour - 1 day)
  - TanStack Query MUST be configured with appropriate `staleTime` and `cacheTime` to reduce redundant requests
  - User progress data MUST be cached in Redis for frequently accessed data
  - HTTP caching headers MUST be set (`Cache-Control`, `ETag`) for GET requests
- **Scalability**:
  - Backend MUST be stateless (no session storage; use JWT)
  - Database connections MUST use connection pooling (max 20 connections per instance)
  - File uploads MUST be stored in object storage (e.g., AWS S3, MinIO), not filesystem
  - Horizontal scaling MUST be supported via load balancer (no in-memory state)

**Rationale**: Performance directly impacts user experience and retention. React.memo, useMemo, and useCallback prevent unnecessary re-renders. TanStack Router provides automatic code splitting. Rsbuild (Rspack) offers blazing-fast builds. Scalability ensures the app can grow without major architectural changes. Proactive optimization is cheaper than reactive fixes.

---

### Principle 10: Documentation & Context7 Integration

**Declaration**: All code MUST be documented to enable AI-assisted development via Context7 and facilitate human understanding.

**Rules**:
- **Code Documentation**:
  - All public classes, methods, and functions MUST have TSDoc comments describing purpose, parameters, return values, and exceptions
  - Example TSDoc format:
    ```typescript
    /**
     * Retrieves an article by ID with associated quiz questions.
     * @param id - The unique identifier of the article
     * @returns Promise resolving to Article entity with questions
     * @throws ArticleNotFoundException if article not found
     */
    async findArticleById(id: string): Promise<Article> { ... }
    ```
  - Complex algorithms or business logic MUST have inline comments explaining "why", not "what"
  - Magic numbers MUST be replaced with named constants
- **API Documentation**:
  - All backend endpoints MUST be documented with Swagger/OpenAPI decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`)
  - DTOs MUST include `@ApiProperty` decorators with descriptions and examples
  - Swagger UI MUST be accessible at `/api/docs` in development mode
- **Architecture Documentation**:
  - High-level architecture diagram MUST be maintained (frontend, backend, database relationships)
  - Module interaction diagram MUST be documented for each major feature
  - Database schema MUST be documented (ERD or schema.md)
- **Context7 Integration**:
  - README MUST reference Context7 as the primary documentation source for dependency APIs
  - When adding new dependencies, a Context7 query MUST be documented in comments (e.g., `// Context7: /facebook/react`, `// Context7: /tanstack/query`)
  - AI prompts MUST reference this constitution for architectural decisions
  - Key Context7 libraries to reference:
    - `/facebook/react` - React core documentation
    - `/tanstack/router` - TanStack Router
    - `/tanstack/query` - TanStack Query (React Query)
    - `/radix-ui/primitives` - Radix UI primitives (Shadcn UI foundation)
    - `/tailwindlabs/tailwindcss` - Tailwind CSS
- **Change Documentation**:
  - Commit messages MUST follow conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
  - Breaking changes MUST be documented in commit body with `BREAKING CHANGE:` footer
  - Pull requests MUST link to related specifications in `.specify/specs/`

**Rationale**: Documentation reduces onboarding time, enables effective AI assistance, and prevents knowledge silos. TSDoc and OpenAPI provide structured, machine-readable docs.

---

## Governance

### Amendment Process

1. **Proposal**: Any team member may propose a constitutional amendment by creating a pull request modifying this file.
2. **Discussion**: Proposed amendments MUST be discussed with rationale (why is change needed? what problem does it solve?).
3. **Approval**: Amendments require approval from at least one project lead or majority vote of core contributors.
4. **Version Bump**:
   - **MAJOR** (X.0.0): Backward-incompatible changes (principle removal, major redefinition)
   - **MINOR** (0.X.0): New principle added or existing principle materially expanded
   - **PATCH** (0.0.X): Clarifications, wording improvements, typo fixes
5. **Propagation**: Upon approval, the Sync Impact Report MUST be updated, and dependent templates/docs MUST be reviewed for consistency.

### Compliance Review

- **Pre-Commit**: Developers SHOULD self-review against constitution before committing.
- **Code Review**: Pull request reviewers MUST verify constitutional compliance (checklist in PR template).
- **Quarterly Audit**: Project leads MUST conduct quarterly reviews to identify constitutional drift and propose amendments.

### Versioning Policy

- This constitution follows Semantic Versioning 2.0.0.
- Version updates MUST include updated `LAST_AMENDED_DATE` and Sync Impact Report.
- Historical versions SHOULD be preserved via Git history or explicit versioned copies.

### Enforcement

- Non-compliance discovered in code review MUST be rejected until corrected.
- Repeated or severe violations SHOULD trigger architectural review meeting.
- Edge cases requiring principle deviation MUST be documented with `// CONSTITUTION-DEVIATION: <reason>` comment and reviewed by project lead.

---

## Integration with SpecKit Workflow

This constitution governs the entire SpecKit development workflow:

1. **Feature Planning** (`.specify/plans/`): Plans MUST reference applicable constitutional principles and demonstrate compliance.
2. **Specification** (`.specify/specs/`): Specs MUST include a "Constitutional Compliance" section mapping requirements to principles.
3. **Task Breakdown** (`.specify/tasks/`): Tasks MUST be categorized by relevant principles (e.g., "Type Safety", "Testing", "Documentation").
4. **Implementation**: All code MUST adhere to principles; deviations require explicit justification.

---

## Appendix: Quick Reference

| Principle | Key Rule | Validation |
|-----------|----------|------------|
| 1. Tech Stack Integrity | React 19+, Shadcn UI, TanStack Router, Zustand, NestJS, PostgreSQL | Check `package.json`, no competing frameworks |
| 2. Modular Architecture | Feature folders with pages/components/hooks/stores, lazy routes | Verify TanStack Router code splitting, no cross-feature imports |
| 3. Type Safety First | Strict mode, no `any` | Biome rule: TypeScript strict checks |
| 4. Comprehensive Validation | React Hook Form + Zod, backend DTOs, DB constraints | Check Zod schemas, class-validator, constraints |
| 5. Secure Auth & Authz | JWT, RBAC, rate limiting | Test guards, verify token expiry |
| 6. Four Skills Standards | Consistent feature structure with Shadcn UI components | Verify each skill has required pages/hooks/stores |
| 7. Error Handling & Observability | Error Boundaries, Axios interceptors, Sonner toasts | Check error handling, Axios config, log format |
| 8. Testing Discipline | ≥80% coverage, Vitest, React Testing Library, Playwright | Run coverage report, check CI config |
| 9. Performance & Scalability | React.memo, TanStack Router lazy loading, caching | Bundle size check, query performance, React DevTools |
| 10. Documentation & Context7 | TSDoc, OpenAPI, React/TanStack Context7 refs | Verify Swagger UI, TSDoc, Context7 comments |

---

**End of Constitution**

*This document is the supreme authority for all architectural and implementation decisions in the EnglishMaster project. When in doubt, refer to this constitution.*
