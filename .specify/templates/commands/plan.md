---
description: Create a high-level feature plan with constitutional alignment, technical design overview, and implementation phases.
handoffs: 
  - label: Create Detailed Specification
    agent: speckit.specify
    prompt: Create a detailed specification from this plan...
  - label: Create Task Breakdown
    agent: speckit.tasks
    prompt: Break down this plan into actionable tasks...
---

## User Input

```text
{user_input}
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are creating a feature plan using the template at `.specify/templates/plan-template.md`. A plan is a high-level design document that comes before detailed specification.

Follow this execution flow:

1. **Constitution Review**:
   - Load and review `.specify/memory/constitution.md`
   - Complete the Constitutional Alignment Check section
   - Identify relevant principles for this feature

2. **Feature Analysis**:
   - Extract feature description from user input
   - Define business value and user stories
   - Determine scope (what's in, what's out, what's deferred)
   - Identify dependencies (external services, other features, libraries)

3. **Architecture Planning**:
   - Plan frontend module structure
   - Plan backend module structure
   - Design database schema at high level
   - Define API endpoints and contracts
   - Plan state management approach (NgRx/Signal Store)

4. **Cross-Cutting Concerns**:
   - Plan validation strategy (frontend, backend, database)
   - Plan security approach (authentication, authorization)
   - Plan error handling approach
   - Plan testing strategy with coverage targets
   - Plan performance optimizations

5. **Implementation Phasing**:
   - Break implementation into logical phases
   - Estimate effort for each phase
   - Identify risks and mitigations
   - Define success criteria

6. **Documentation Planning**:
   - Identify documentation deliverables
   - Plan API documentation approach
   - Plan user documentation if needed

7. **Plan Generation**:
   - Load `.specify/templates/plan-template.md`
   - Fill in all sections systematically
   - Remove placeholder brackets
   - Add today's date and set status to "Draft"
   - Be specific but avoid implementation details (those go in spec)

8. **Constitutional Compliance**:
   - Check each checkbox in the Constitutional Alignment Check
   - Document any deviations with justification
   - Ensure all 10 principles are addressed

9. **Validation**:
   - Ensure all user stories are actionable
   - Ensure scope is clearly defined
   - Ensure technical design is high-level but complete
   - Ensure phases are logical and ordered
   - Ensure success criteria are measurable

10. **Output**:
    - Save plan to `.specify/plans/[feature-name]-plan.md`
    - Generate summary for user including:
      - Feature overview
      - Implementation phases
      - Total estimated effort
      - Key risks
      - Next steps

## Difference Between Plan and Spec

**Plan** (this command):
- High-level design and approach
- Implementation phases
- Effort estimation
- Risk analysis
- Created early in feature development

**Spec** (speckit.specify):
- Detailed technical design
- Complete API contracts
- Full TypeScript interfaces
- Detailed test cases
- Ready for immediate implementation

## File Naming Convention

Save plans using kebab-case:
- `.specify/plans/reading-module-plan.md`
- `.specify/plans/user-authentication-plan.md`
- `.specify/plans/essay-feedback-system-plan.md`

## Quality Standards

Your plan MUST meet these standards:

- **Strategic**: Focuses on "what" and "why", not "how" in detail
- **Constitutional**: Explicit alignment with all relevant principles
- **Phased**: Clear implementation phases with dependencies
- **Risk-Aware**: Identifies potential issues and mitigations
- **Estimable**: Provides effort estimates for planning
- **Testable**: Success criteria are measurable

## Context7 Usage

When you need framework guidance:
- Use Context7 for Angular, NestJS, PostgreSQL best practices
- Reference current documentation for architectural patterns
- Validate approaches against framework recommendations

## Communication

After generating the plan:
1. Provide a brief executive summary
2. Highlight constitutional alignment status
3. Note any critical risks or dependencies
4. Suggest whether to proceed to detailed spec or task breakdown
5. Provide total effort estimate

If critical information is missing, ask the user before proceeding.

