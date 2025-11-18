---
description: Break down a feature specification or plan into granular, actionable tasks organized by constitutional principles.
handoffs: 
  - label: Start Implementation
    agent: speckit.build
    prompt: Begin implementing these tasks starting with...
---

## User Input

```text
{user_input}
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are creating a task breakdown using the template at `.specify/templates/tasks-template.md`. This document organizes all work items needed to implement a feature, categorized by constitutional principles.

Follow this execution flow:

1. **Input Analysis**:
   - Determine if user provided a specification, plan, or feature description
   - If spec/plan exists, load it from `.specify/specs/` or `.specify/plans/`
   - If only description provided, create lightweight task breakdown

2. **Constitution Review**:
   - Load `.specify/memory/constitution.md`
   - Review all 10 principles for task categorization

3. **Task Extraction**:
   - Extract all implementation tasks from the spec/plan
   - Break large tasks into smaller, atomic tasks (max 4-8 hours each)
   - Ensure each task has a clear deliverable

4. **Task Organization by Principle**:

   **Category 1 - Architecture & Setup** (Principles 1, 2):
   - Frontend module setup
   - Backend module setup
   - Database schema creation
   - Module configuration

   **Category 2 - Type Safety & Contracts** (Principle 3):
   - TypeScript interface definitions
   - DTO creation
   - Type guard implementation
   - API contract definition

   **Category 3 - Validation Implementation** (Principle 4):
   - Frontend validation
   - Backend validation (class-validator)
   - Database constraints
   - Custom validation rules

   **Category 4 - Security Implementation** (Principle 5):
   - Authentication setup
   - Authorization guards
   - Rate limiting
   - Security hardening

   **Category 5 - Feature Development** (Principle 6):
   - Component development
   - Service layer implementation
   - Backend business logic
   - State management (NgRx/Signal Store)
   - Skill-specific implementations

   **Category 6 - Error Handling** (Principle 7):
   - Frontend error handling
   - Backend exception filters
   - Logging setup
   - Monitoring configuration

   **Category 7 - Testing Implementation** (Principle 8):
   - Unit tests
   - Integration tests
   - Component tests
   - E2E tests

   **Category 8 - Performance Optimization** (Principle 9):
   - Frontend optimization
   - Backend optimization
   - Database optimization
   - Performance testing

   **Category 9 - Documentation** (Principle 10):
   - Code documentation (TSDoc)
   - API documentation (Swagger)
   - Developer documentation
   - User documentation

   **Category 10 - Deployment & Validation**:
   - Pre-deployment checklist
   - Database migrations
   - Production deployment
   - Post-deployment validation

5. **Task Details**:
   For each task, provide:
   - Clear, actionable description
   - Checklist of concrete deliverables
   - Estimated effort (hours or days)
   - Dependencies (which tasks must complete first)
   - Assignee placeholder

6. **Dependency Mapping**:
   - Create task dependency graph
   - Identify tasks that can run in parallel
   - Identify critical path
   - Ensure logical ordering

7. **Effort Estimation**:
   - Estimate each task individually
   - Sum by category
   - Calculate total effort
   - Note any high-risk or complex tasks

8. **Progress Tracking**:
   - Initialize progress tracking table
   - Set all tasks to incomplete
   - Provide percentage calculation structure

9. **Risk Identification**:
   - Identify tasks with technical risk
   - Note external dependencies
   - Suggest mitigation strategies

10. **Task Breakdown Generation**:
    - Load `.specify/templates/tasks-template.md`
    - Fill in all categories with extracted tasks
    - Remove empty categories if no tasks
    - Add today's date
    - Calculate total estimated effort

11. **Validation**:
    - Ensure every task has deliverables
    - Ensure dependencies are valid
    - Ensure no circular dependencies
    - Ensure effort estimates are reasonable
    - Ensure all constitutional principles are covered

12. **Output**:
    - Save task breakdown to `.specify/tasks/[feature-name]-tasks.md`
    - Generate summary for user including:
      - Total number of tasks
      - Total estimated effort
      - Number of tasks per category
      - Critical path tasks
      - High-risk tasks

## Task Granularity Guidelines

- **Atomic**: Each task should be completable independently
- **Sized**: 2-8 hours for most tasks; flag larger tasks
- **Testable**: Clear definition of "done"
- **Assignable**: Can be assigned to one developer
- **Estimable**: Complexity is understood enough to estimate

## File Naming Convention

Save task breakdowns using kebab-case:
- `.specify/tasks/reading-module-tasks.md`
- `.specify/tasks/user-authentication-tasks.md`
- `.specify/tasks/essay-feedback-system-tasks.md`

## Dependency Notation

Use task IDs for dependencies:
- Task 1.1: No dependencies
- Task 2.1: Dependencies: 1.1, 1.2
- Task 5.3: Dependencies: 2.1, 3.2, 4.1

## Quality Standards

Your task breakdown MUST meet these standards:

- **Complete**: Covers all work needed to implement the feature
- **Organized**: Logically grouped by constitutional principles
- **Specific**: Each task has concrete deliverables
- **Estimated**: All tasks have effort estimates
- **Sequenced**: Dependencies are clear and valid
- **Trackable**: Progress can be measured

## Sprint Planning

If the user mentions sprint planning:
- Group tasks by sprint or milestone
- Respect sprint capacity constraints
- Prioritize critical path tasks
- Balance across team members

## Communication

After generating the task breakdown:
1. Provide total task count and effort estimate
2. Highlight the critical path
3. Note any high-risk or blocking tasks
4. Suggest implementation order
5. Offer to begin implementation

If the specification or plan is incomplete, ask the user for clarification before generating tasks.

