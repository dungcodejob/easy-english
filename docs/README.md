# EnglishMaster

A full-stack English learning application designed to help users master the four core language skills: Reading, Writing, Speaking, and Listening.

## Technology Stack

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

## Core Features

### 1. Reading Module
- Article management with difficulty levels (A1-C2)
- Inline vocabulary tooltips
- Multiple-choice and fill-in-the-blank quizzes
- Progress tracking per article

### 2. Writing Module
- Rich text editor for essay submission
- Word count and basic grammar feedback
- Prompt management with topic categories
- Submission history and revision tracking

### 3. Speaking Module
- Audio recording (max 5 minutes) with waveform visualization
- Pronunciation comparison against reference audio
- Speech-to-text transcription
- Practice history with playback

### 4. Listening Module
- Audio player with speed control (0.5x - 2x)
- Transcript reveal option
- Comprehension questions (multiple choice, true/false)
- Progress tracking with accuracy metrics

## Project Constitution

This project follows a constitutional governance model. All development must adhere to the principles defined in [`.specify/memory/constitution.md`](.specify/memory/constitution.md).

### Core Principles

1. **Technology Stack Integrity** - React 19+, Shadcn UI, TanStack ecosystem, NestJS, PostgreSQL
2. **Modular Architecture** - Feature-based folders with lazy loading via TanStack Router
3. **Type Safety First** - TypeScript strict mode, no `any` types, Biome linting
4. **Comprehensive Validation** - React Hook Form + Zod, backend DTOs, database constraints
5. **Secure Authentication & Authorization** - JWT, RBAC, security hardening
6. **Four Skills Implementation Standards** - Consistent patterns with Shadcn UI components
7. **Error Handling & Observability** - Error Boundaries, Axios interceptors, Sonner toasts
8. **Testing Discipline** - ≥80% coverage with Vitest, React Testing Library, Playwright
9. **Performance & Scalability** - React optimization (memo, useMemo), Rsbuild, caching
10. **Documentation & Context7 Integration** - TSDoc, OpenAPI, React/TanStack docs

## Getting Started

### Prerequisites

- Node.js v20+
- Bun v1.0+ (or npm/yarn as fallback)
- PostgreSQL v14+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd easy-english

# Install frontend dependencies
cd client
bun install  # or npm install

# Install backend dependencies (when available)
cd ../backend
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migration:run

# Start development servers
# Terminal 1 - Frontend (from /client directory)
cd client
bun dev  # or npm run dev

# Terminal 2 - Backend (from /backend directory)
cd backend
npm run start:dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=englishmaster

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development
```

## Development Workflow

### Using the Specification System

EnglishMaster uses **SpecKit** for feature development:

#### 1. Create a Feature Plan

```bash
/speckit.plan create plan for [feature description]
```

Generates: `.specify/plans/[feature-name]-plan.md`

#### 2. Create Detailed Specification

```bash
/speckit.specify create spec for [feature description]
```

Generates: `.specify/specs/[feature-name]-spec.md`

#### 3. Break Down into Tasks

```bash
/speckit.tasks break down [feature-name]
```

Generates: `.specify/tasks/[feature-name]-tasks.md`

#### 4. Implement

```bash
/speckit.build implement [feature-name]
```

See [`.specify/README.md`](.specify/README.md) for complete documentation.

## Project Structure

```
easy-english/
├── .specify/                   # Specification system (SpecKit)
│   ├── memory/
│   │   └── constitution.md     # Project constitution
│   ├── templates/              # Document templates
│   ├── plans/                  # Feature plans
│   ├── specs/                  # Feature specifications
│   └── tasks/                  # Task breakdowns
├── client/                     # React application (Rsbuild + TypeScript)
│   ├── src/
│   │   ├── features/           # Feature modules (auth, reading, writing, speaking, listening)
│   │   │   ├── [skill]/
│   │   │   │   ├── pages/      # Route components
│   │   │   │   ├── components/ # Feature components
│   │   │   │   ├── hooks/      # Custom hooks (TanStack Query)
│   │   │   │   ├── services/   # API client functions (Axios)
│   │   │   │   ├── stores/     # Zustand stores
│   │   │   │   ├── types/      # TypeScript types
│   │   │   │   └── index.ts    # Barrel exports
│   │   ├── components/         # Shared components (Shadcn UI)
│   │   │   ├── ui/             # Shadcn UI components
│   │   │   └── layout/         # Layout components
│   │   ├── hooks/              # Shared custom hooks
│   │   ├── stores/             # Global Zustand stores
│   │   ├── lib/                # Utility functions
│   │   ├── styles/             # Global styles (Tailwind CSS)
│   │   └── assets/             # Images, fonts, etc.
│   ├── rsbuild.config.ts       # Rsbuild configuration
│   ├── biome.json              # Biome linter/formatter config
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json            # Frontend dependencies
├── backend/                    # NestJS application (to be created)
│   ├── src/
│   │   ├── modules/            # Feature modules
│   │   │   ├── reading/
│   │   │   ├── writing/
│   │   │   ├── speaking/
│   │   │   └── listening/
│   │   ├── common/             # Common utilities, filters, pipes
│   │   ├── config/             # Configuration
│   │   └── database/           # Database entities, migrations
│   └── ...
├── docs/                       # Additional documentation
├── README.md                   # This file
└── .gitignore
```

## Quality Standards

All code must meet these standards:

- **Type Safety**: TypeScript strict mode, no `any` types
- **Testing**: ≥80% unit test coverage (Vitest + React Testing Library)
- **Linting/Formatting**: Biome for unified code quality (replaces ESLint + Prettier)
- **Validation**: React Hook Form + Zod on frontend, class-validator on backend
- **Security**: All inputs validated, JWT authentication, RBAC on protected routes
- **Performance**: Lazy loading via TanStack Router, React optimization, optimized queries, caching
- **Documentation**: TSDoc comments on all public APIs, Context7 references

## Testing

```bash
# Frontend tests (from /client directory)
cd client
bun test              # Run all tests (Vitest + React Testing Library)
bun test:coverage     # Run with coverage
bun test:e2e          # Run E2E tests (Playwright)

# Backend tests (from /backend directory)
cd backend
npm run test          # Run all tests (Jest + Supertest)
npm run test:cov      # Run with coverage
npm run test:e2e      # Run E2E tests

# Run specific test suite
bun test auth         # Frontend
npm run test -- auth  # Backend
```

## Building for Production

```bash
# Build frontend (from /client directory)
cd client
bun run build         # Rsbuild production build

# Preview production build locally
bun run preview

# Build backend (from /backend directory)
cd backend
npm run build         # NestJS production build
npm run start:prod    # Run production server
```

## Contributing

1. Review the [constitution](.specify/memory/constitution.md) to understand project principles
2. Create a feature plan/spec using SpecKit
3. Implement following the task breakdown
4. Ensure all tests pass and coverage ≥80%
5. Verify constitutional compliance
6. Submit PR with reference to spec/plan

## Code Review Checklist

- [ ] Constitutional compliance verified (see `.specify/memory/constitution.md`)
- [ ] All tests passing (≥80% coverage - Vitest + React Testing Library)
- [ ] Type safety validated (no `any` types, Biome checks passing)
- [ ] Forms use React Hook Form + Zod validation
- [ ] Components use Shadcn UI where applicable
- [ ] Security review completed (authentication, authorization, input validation)
- [ ] Performance benchmarks met (bundle size ≤500KB gzipped)
- [ ] Documentation complete (TSDoc + OpenAPI + Context7 references)
- [ ] No Biome linter/formatter errors
- [ ] Database migrations included (if applicable)

## License

[Your License Here]

## Support

For questions or issues:
- Review the [constitution](.specify/memory/constitution.md)
- Check the [specification system](.specify/README.md)
- Open an issue on GitHub

---

**Version**: 2.0.0  
**Last Updated**: 2025-11-18  
**Status**: React Stack Migration Complete

