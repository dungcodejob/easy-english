---
description: Create a detailed feature specification from user requirements, ensuring constitutional compliance and complete technical design.
handoffs: 
  - label: Create Task Breakdown
    agent: speckit.tasks
    prompt: Break down this specification into actionable tasks...
  - label: Start Implementation
    agent: speckit.build
    prompt: Begin implementing this feature...
---

## User Input

```text
{user_input}
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are creating a feature specification using the template at `.specify/templates/spec-template.md`. Your goal is to produce a complete, implementation-ready specification that adheres to the EnglishMaster constitution.

Follow this execution flow:

1. **Constitution Review**:
   - Load and review `.specify/memory/constitution.md`
   - Identify which principles are most relevant to this feature
   - Note any specific constraints or requirements from the constitution

2. **Requirements Gathering**:
   - Analyze user input to extract functional requirements
   - Identify non-functional requirements (performance, security, scalability)
   - Determine which of the four skills (Reading, Writing, Speaking, Listening) this feature relates to
   - Check for any missing critical information and ask user if needed

3. **Technical Design**:
   - Design frontend architecture (Angular components, services, state management)
   - Design backend architecture (NestJS modules, controllers, services)
   - Design database schema (tables, relationships, indexes)
   - Define API contracts with full TypeScript types
   - Plan validation strategy (frontend, backend, database layers)

4. **Security Analysis**:
   - Determine authentication requirements (Public, Student, Teacher, Admin)
   - Define authorization rules and role-based access
   - Identify sensitive data and protection measures
   - Plan rate limiting and security hardening

5. **Testing Strategy**:
   - Define unit test cases for services and utilities
   - Define integration test cases for API endpoints
   - Define E2E test cases for critical user flows
   - Define component test cases for UI interactions
   - Set coverage targets (≥80% for unit tests)

6. **Performance Planning**:
   - Set response time targets
   - Plan optimization strategies (caching, query optimization, lazy loading)
   - Identify scalability considerations

7. **Documentation Requirements**:
   - List all documentation deliverables
   - Plan API documentation (OpenAPI/Swagger)
   - Plan user-facing documentation if needed

8. **Specification Generation**:
   - Load `.specify/templates/spec-template.md`
   - Fill in all sections with concrete, specific information
   - Remove placeholder brackets and template comments
   - Ensure no "TBD" or "TODO" items remain without justification
   - Add version 1.0.0 and today's date

9. **Constitutional Compliance Check**:
   - Verify alignment with Principle 1 (Technology Stack)
   - Verify alignment with Principle 2 (Modular Architecture)
   - Verify alignment with Principle 3 (Type Safety)
   - Verify alignment with Principle 4 (Validation)
   - Verify alignment with Principle 5 (Security)
   - Verify alignment with Principle 6 (Four Skills Standards)
   - Verify alignment with Principle 7 (Error Handling)
   - Verify alignment with Principle 8 (Testing)
   - Verify alignment with Principle 9 (Performance)
   - Verify alignment with Principle 10 (Documentation)
   - Document any deviations with justification

10. **Validation**:
    - Ensure all TypeScript interfaces are valid
    - Ensure all API endpoints are fully specified
    - Ensure all database schemas are complete
    - Ensure all acceptance criteria are testable
    - Ensure all error scenarios are addressed

11. **Output**:
    - Save specification to `.specify/specs/[feature-name]-spec.md`
    - Generate summary for user including:
      - Feature overview
      - Key technical decisions
      - Constitutional compliance status
      - Next steps (task breakdown or implementation)
      - Estimated complexity (Low/Medium/High)

## Quality Standards

Your specification MUST meet these standards:

- **Completeness**: All template sections filled with actionable information
- **Specificity**: No vague requirements; everything measurable or testable
- **Type Safety**: All data structures fully typed with TypeScript
- **Security**: Authentication and authorization explicitly defined
- **Testability**: Clear acceptance criteria and test cases
- **Performance**: Concrete performance targets and optimization plans
- **Documentation**: Clear documentation requirements identified

## File Naming Convention

Save specifications using kebab-case:
- `.specify/specs/reading-module-spec.md`
- `.specify/specs/user-authentication-spec.md`
- `.specify/specs/essay-feedback-system-spec.md`

## Context7 Usage

When you need up-to-date documentation for Angular, NestJS, or other libraries:
- Use Context7 to retrieve current best practices
- Reference specific versions mentioned in the constitution
- Document any framework-specific patterns or conventions used

## Communication

After generating the specification:
1. Provide a brief summary of the feature
2. Highlight any constitutional compliance concerns
3. Note any areas requiring user clarification
4. Suggest next steps (task breakdown or implementation)
5. Estimate implementation complexity and effort

Do not create placeholder specifications. If critical information is missing, ask the user for clarification before proceeding.

