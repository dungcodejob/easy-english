# SpecKit Documentation

**Version**: 2.0.0  
**Last Updated**: 2025-11-18  
**Constitution Version**: 2.0.0

## Overview

SpecKit is a specification-driven development system that ensures all features are thoughtfully planned, documented, and validated against the project constitution before implementation.

## Workflow

### 1. Constitution (Foundation)

**Location**: `.specify/memory/constitution.md`

The project constitution defines the governing principles for EnglishMaster. All specifications, plans, and implementations MUST comply with these principles.

**Current Tech Stack**:
- Frontend: React 19+, Shadcn UI, TanStack Router/Query, Zustand
- Backend: NestJS, TypeScript strict mode
- Database: PostgreSQL 14+
- Build: Rsbuild, Bun

**To update the constitution**:

```bash
/speckit.constitution [describe changes]
```

### 2. Feature Planning

**Command**:
```bash
/speckit.plan create plan for [feature description]
```

**Output**: `.specify/plans/[feature-name]-plan.md`

**Purpose**: High-level feature overview including:
- Feature goals and user stories
- Constitutional compliance check
- Technical approach
- Success criteria
- Risks and dependencies

**Example**:
```bash
/speckit.plan create plan for Reading Module with article management and quizzes
```

### 3. Detailed Specification

**Command**:
```bash
/speckit.specify create spec for [feature description]
```

**Output**: `.specify/specs/[feature-name]-spec.md`

**Purpose**: Detailed technical specification including:
- API contracts (endpoints, DTOs, responses)
- Database schema (entities, migrations)
- Frontend components and state management
- Validation rules (Zod schemas, class-validator)
- Error handling patterns
- Testing requirements

**Example**:
```bash
/speckit.specify create spec for Reading Module articles CRUD and quiz system
```

### 4. Task Breakdown

**Command**:
```bash
/speckit.tasks break down [feature-name]
```

**Output**: `.specify/tasks/[feature-name]-tasks.md`

**Purpose**: Break specification into actionable tasks:
- Backend tasks (entities, DTOs, controllers, services)
- Frontend tasks (pages, components, hooks, stores)
- Testing tasks (unit, integration, E2E)
- Documentation tasks (TSDoc, OpenAPI, README)

Tasks are categorized by constitutional principle for easy tracking.

**Example**:
```bash
/speckit.tasks break down reading-module
```

### 5. Implementation

**Command**:
```bash
/speckit.build implement [feature-name]
```

**Purpose**: Execute the implementation following the task breakdown and specification.

Implementation MUST:
- Follow the constitution principles
- Implement all specified tasks
- Include tests (≥80% coverage)
- Add TSDoc documentation
- Pass all linter checks (Biome)

**Example**:
```bash
/speckit.build implement reading-module
```

## Directory Structure

```
.specify/
├── memory/
│   └── constitution.md          # Project constitution (v2.0.0)
├── templates/                    # Document templates (to be created)
│   ├── plan-template.md
│   ├── spec-template.md
│   ├── tasks-template.md
│   └── commands/                 # Command definitions
│       ├── constitution.md
│       ├── plan.md
│       ├── specify.md
│       ├── tasks.md
│       └── build.md
├── plans/                        # Feature plans
│   └── [feature-name]-plan.md
├── specs/                        # Feature specifications
│   └── [feature-name]-spec.md
├── tasks/                        # Task breakdowns
│   └── [feature-name]-tasks.md
└── README.md                     # This file
```

## Constitutional Principles Reference

All SpecKit artifacts must align with these 10 principles:

1. **Technology Stack Integrity**: React 19+, Shadcn UI, TanStack Router/Query, Zustand, NestJS, PostgreSQL
2. **Modular Architecture**: Feature-based folders with lazy loading
3. **Type Safety First**: TypeScript strict mode, no `any` types
4. **Comprehensive Validation**: React Hook Form + Zod, class-validator, DB constraints
5. **Secure Authentication & Authorization**: JWT, RBAC, rate limiting
6. **Four Skills Implementation Standards**: Consistent patterns with Shadcn UI
7. **Error Handling & Observability**: Error Boundaries, Axios interceptors, Sonner toasts
8. **Testing Discipline**: ≥80% coverage with Vitest, React Testing Library, Playwright
9. **Performance & Scalability**: React optimization, Rsbuild, caching
10. **Documentation & Context7 Integration**: TSDoc, OpenAPI, Context7 references

## Best Practices

### Planning Phase

- **Start with "Why"**: Clearly articulate the problem being solved
- **Constitutional Check**: Reference applicable principles upfront
- **User-Centric**: Include user stories and acceptance criteria
- **Risk Assessment**: Identify potential blockers early

### Specification Phase

- **API-First**: Define contracts before implementation
- **Type Safety**: Specify TypeScript interfaces for all data structures
- **Validation Rules**: Document Zod schemas and class-validator decorators
- **Error Cases**: Define error responses and handling strategies
- **Testing Strategy**: Specify what needs to be tested and how

### Task Breakdown Phase

- **Granular**: Break down into 1-4 hour tasks
- **Principle-Tagged**: Categorize by constitutional principle
- **Dependencies**: Mark task dependencies clearly
- **Testable**: Each task should have a clear "done" criterion

### Implementation Phase

- **Test-Driven**: Write tests first or alongside implementation
- **Incremental**: Commit frequently with conventional commit messages
- **Review**: Self-review against constitution before PR
- **Document**: Add TSDoc comments as you code

## Example Workflow

### Scenario: Implementing the Reading Module

```bash
# 1. Create a plan
/speckit.plan create plan for Reading Module with article CRUD, difficulty levels, and quizzes

# Review: .specify/plans/reading-module-plan.md
# Verify constitutional compliance and approach

# 2. Create detailed specification
/speckit.specify create spec for Reading Module with articles, quizzes, and progress tracking

# Review: .specify/specs/reading-module-spec.md
# Verify API contracts, database schema, validation rules

# 3. Break down into tasks
/speckit.tasks break down reading-module

# Review: .specify/tasks/reading-module-tasks.md
# Verify task granularity and dependencies

# 4. Implement
/speckit.build implement reading-module

# Implementation follows the task breakdown with continuous testing
```

## Constitutional Compliance Checklist

Before merging any feature, verify:

- [ ] Technology stack matches constitution (React, Shadcn UI, TanStack, Zustand)
- [ ] Code organized in feature folders with proper structure
- [ ] TypeScript strict mode enabled, no `any` types
- [ ] Validation implemented at all layers (frontend, backend, database)
- [ ] JWT authentication and RBAC implemented
- [ ] Consistent patterns used (matches other skill modules)
- [ ] Error handling with Error Boundaries and Axios interceptors
- [ ] Tests written (≥80% coverage)
- [ ] Performance optimizations applied (lazy loading, React.memo where appropriate)
- [ ] TSDoc comments and OpenAPI documentation added
- [ ] Biome linter passes with no errors

## Amending the Constitution

To propose a constitutional amendment:

1. Create a PR modifying `.specify/memory/constitution.md`
2. Include rationale (why is this change needed?)
3. Specify version bump type (MAJOR, MINOR, or PATCH)
4. Update Sync Impact Report
5. Get approval from project lead
6. Update dependent documentation (README, templates)

## Context7 Integration

When implementing features, reference Context7 documentation:

- `/facebook/react` - React core APIs
- `/tanstack/router` - TanStack Router patterns
- `/tanstack/query` - TanStack Query (data fetching)
- `/radix-ui/primitives` - Radix UI components (Shadcn UI foundation)
- `/tailwindlabs/tailwindcss` - Tailwind CSS utilities
- `/colinhacks/zod` - Zod validation schemas
- `/nestjs/nest` - NestJS backend patterns

Example comment:
```typescript
// Context7: /tanstack/query - useQuery hook for data fetching
const { data, isLoading } = useQuery({ queryKey: ['articles'], queryFn: fetchArticles });
```

## Support

- **Constitution**: [.specify/memory/constitution.md](.specify/memory/constitution.md)
- **Main README**: [../README.md](../README.md)
- **Questions**: Open an issue or review existing specs for examples

---

**Remember**: The constitution is the supreme authority. When in doubt, consult it first.
