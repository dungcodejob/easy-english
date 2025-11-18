# Feature Specification: Topic List Management

**Feature ID**: 1-topic-list-management  
**Version**: 1.0.0  
**Created**: 2025-11-18  
**Status**: Draft  
**Constitutional Version**: 2.0.0

---

## Overview

### Purpose

This feature provides a browsable catalog of vocabulary topics that students can explore to find learning content organized by real-world themes (Food, Travel, Business, etc.). The topic list serves as the main entry point for vocabulary learning, allowing users to discover topics that match their interests and proficiency level.

### Target Users

**Primary Users**:
- **Students**: Browse topics to find vocabulary sets matching their interests and skill level

**Secondary Users**:
- **Teachers**: Review available topics to recommend to students
- **Administrators**: Manage topic catalog (create, edit, organize topics)

### Business Value

Organizing vocabulary by real-world topics (rather than alphabetically or randomly) helps students:
- Find relevant vocabulary faster based on their personal interests or professional needs
- Understand the practical context where words are used (e.g., "reservation" in Travel vs. Business)
- Stay motivated by choosing topics they care about
- Progress through difficulty levels systematically within a topic domain

This improves engagement and learning outcomes by making vocabulary acquisition feel purposeful and contextualized.

---

## User Scenarios

### Primary Use Cases

1. **Browse Available Topics**
   - **Actor**: Student
   - **Goal**: Discover what vocabulary topics are available to learn
   - **Flow**: 
     1. Student navigates from Home to Topic List
     2. System displays all available topics in the selected view mode (grid by default)
     3. Student scans topics, viewing icons, word counts, and difficulty levels
     4. Student identifies topics of interest
   - **Outcome**: Student has clear overview of available learning content

2. **Filter Topics by Difficulty Level**
   - **Actor**: Student
   - **Goal**: Find topics appropriate for their current proficiency
   - **Flow**: 
     1. Student is on Topic List screen
     2. Student selects difficulty filter: Beginner, Intermediate, or Advanced
     3. System filters and displays only topics matching selected level
     4. Student can clear filter to see all topics again
   - **Outcome**: Student sees only topics matching their skill level

3. **Switch Display Mode**
   - **Actor**: Student
   - **Goal**: View topics in their preferred layout (grid, card, or list)
   - **Flow**: 
     1. Student is on Topic List screen
     2. Student clicks display mode toggle (grid/card/list icons)
     3. System instantly re-renders topics in selected layout
     4. System remembers preference for future visits
   - **Outcome**: Topics displayed in user's preferred visual format

4. **Select Topic to View Details**
   - **Actor**: Student
   - **Goal**: Learn more about a topic before starting vocabulary lessons
   - **Flow**: 
     1. Student is on Topic List screen browsing topics
     2. Student clicks on a topic card/item
     3. System navigates to Topic Detail screen showing full description, word list preview, and lessons
     4. Student can return to Topic List or start learning
   - **Outcome**: Student has detailed information to decide if they want to study this topic

5. **Search Topics by Keyword**
   - **Actor**: Student
   - **Goal**: Quickly find a specific topic without browsing entire list
   - **Flow**: 
     1. Student types keyword in search bar (e.g., "food", "business")
     2. System filters topics in real-time as user types
     3. System highlights matching terms in topic names and descriptions
     4. Student sees only relevant results
   - **Outcome**: Student finds desired topic quickly

### Edge Cases

- **No Topics Available**: System displays empty state message "No topics available yet. Check back soon!" with illustration
- **Search Returns No Results**: System displays "No topics found for '[query]'. Try different keywords." with option to clear search
- **User Changes Display Mode on Mobile**: Grid view automatically switches to single-column on small screens; list view remains optimal for mobile
- **Very Long Topic Descriptions**: Descriptions are truncated to 2 lines with "..." and "Read more" link in grid/card view; full description visible in list view or detail screen
- **Topic Has Zero Words**: Display "Coming soon" instead of word count; topic still selectable but shows "Content in development" on detail screen
- **Slow Network Connection**: Topics load progressively with skeleton screens; user can interact with loaded topics while remaining load

---

## Functional Requirements

### Core Functionality

**FR-1**: Display Topic Catalog
- **Description**: System shall display all available vocabulary topics with essential information (icon, name, word count, level, description) in a browsable interface.
- **Acceptance Criteria**:
  - [ ] All published topics are visible (ordered by display order, then name alphabetically)
  - [ ] Each topic displays: icon/emoji, name, word count, difficulty level badge, truncated description
  - [ ] Topics are displayed in user's selected view mode (grid, card, or list)
  - [ ] Page loads with skeleton screens, then replaces with actual topics within 2 seconds
  - [ ] If no topics exist, empty state message is displayed
- **Priority**: High

**FR-2**: Multiple Display Modes
- **Description**: Users shall be able to switch between three view modes (grid, card, list) to view topics in their preferred layout.
- **Acceptance Criteria**:
  - [ ] Three toggle buttons are visible: Grid icon, Card icon, List icon
  - [ ] Only one mode is active at a time (visual indicator on active mode)
  - [ ] Clicking a mode button immediately re-renders topics in that layout
  - [ ] User's preference is saved and applied on next visit (localStorage or user profile)
  - [ ] Default mode is grid view for new/anonymous users
  - [ ] Responsive: Grid auto-adjusts columns (4 on desktop, 2 on tablet, 1 on mobile)
- **Priority**: High

**FR-3**: Filter by Difficulty Level
- **Description**: Users shall be able to filter topics by difficulty level (Beginner, Intermediate, Advanced, or All).
- **Acceptance Criteria**:
  - [ ] Four filter options available: All (default), Beginner, Intermediate, Advanced
  - [ ] Selecting a level filters topics instantly (no page reload)
  - [ ] Active filter is visually highlighted
  - [ ] Topic count badge shows number of results (e.g., "Beginner (12)")
  - [ ] "Clear filters" button appears when any filter is active
  - [ ] Filter state persists during session but resets to "All" on new session
- **Priority**: High

**FR-4**: Search Topics
- **Description**: Users shall be able to search topics by name or description keywords to quickly find relevant content.
- **Acceptance Criteria**:
  - [ ] Search input field is prominently displayed at top of Topic List
  - [ ] Search filters topics in real-time as user types (debounced by 300ms)
  - [ ] Search matches against topic name and description (case-insensitive)
  - [ ] Matching keywords are visually highlighted in results
  - [ ] "Clear search" button appears when search input is not empty
  - [ ] If no results found, helpful message is displayed with option to clear search
  - [ ] Search works in combination with difficulty filter (both filters apply)
- **Priority**: Medium

**FR-5**: Navigate to Topic Detail
- **Description**: Users shall be able to click on any topic to view its detail screen with full information and available lessons.
- **Acceptance Criteria**:
  - [ ] Clicking anywhere on topic card/item navigates to Topic Detail screen
  - [ ] Topic ID is passed in URL route (e.g., `/topics/[topic-id]`)
  - [ ] Hover state provides visual feedback (cursor pointer, subtle scale/shadow)
  - [ ] Back navigation returns user to Topic List with same filters/search/scroll position preserved
  - [ ] Keyboard accessible (Enter/Space key triggers navigation)
- **Priority**: High

**FR-6**: Responsive Layout
- **Description**: Topic List shall adapt seamlessly to different screen sizes (desktop, tablet, mobile) with optimal layouts for each.
- **Acceptance Criteria**:
  - [ ] Desktop (≥1024px): Grid shows 4 columns, Card shows 3 columns, List shows 1 column
  - [ ] Tablet (768-1023px): Grid shows 2 columns, Card shows 2 columns, List shows 1 column
  - [ ] Mobile (<768px): All modes show 1 column (optimized for touch)
  - [ ] Touch gestures work smoothly on mobile (tap to select, scroll to browse)
  - [ ] No horizontal scrolling on any screen size
  - [ ] Typography scales appropriately (larger on mobile for readability)
- **Priority**: High

### Data Requirements

**DR-1**: Topic Entity
- **Description**: Core data structure representing a vocabulary topic that groups related words together.
- **Required Fields**:
  - `id` (UUID): Unique identifier
  - `name` (string, 3-50 chars): Topic name (e.g., "Food & Dining", "Business Communication")
  - `slug` (string): URL-friendly identifier derived from name (e.g., "food-dining")
  - `icon` (string): Emoji character or icon identifier (e.g., "🍕", "icon-food-01")
  - `description` (string, 50-300 chars): Brief explanation of what vocabulary is covered
  - `level` (enum): Difficulty level - `beginner`, `intermediate`, `advanced`
  - `word_count` (integer): Number of vocabulary words in this topic
  - `display_order` (integer): Custom sorting order (lower numbers appear first)
  - `is_published` (boolean): Whether topic is visible to students (unpublished topics hidden)
  - `created_at` (timestamp): When topic was created
  - `updated_at` (timestamp): Last modification time
- **Optional Fields**:
  - `color_theme` (string): Hex color code for visual theming (e.g., "#FF5733" for Food)
  - `related_skills` (array of enums): Which skills use this topic - `reading`, `writing`, `listening`, `speaking`
  - `recommended_for` (array of strings): User profiles this topic suits (e.g., "travelers", "business professionals")
  - `estimated_hours` (decimal): Estimated time to complete all words in topic
  - `preview_words` (array of strings): 3-5 sample words to preview content (e.g., ["restaurant", "reservation", "menu"])
  - `banner_image_url` (string): Optional visual banner for topic (URL to image)
- **Validation Rules**:
  - `name` must be unique
  - `slug` must be unique and URL-safe (lowercase, hyphens only)
  - `icon` must be valid emoji or registered icon identifier
  - `description` must be between 50-300 characters
  - `word_count` must be non-negative integer (0 allowed for "coming soon" topics)
  - `level` must be one of: `beginner`, `intermediate`, `advanced`
  - `display_order` defaults to 999 (appears at end) if not specified

### User Interface Requirements

**UI-1**: Topic List Screen Header
- **Description**: Top section containing page title, view mode toggles, search, and filters.
- **Elements**:
  - **Page Title**: "Vocabulary Topics" or "Choose a Topic" (H1 heading)
  - **Breadcrumb**: Home > Topics (clickable navigation)
  - **View Mode Toggle**: Three icon buttons (Grid/Card/List) with active state indicator
  - **Search Bar**: Text input with search icon, placeholder "Search topics...", clear button when populated
  - **Difficulty Filter**: Pill/button group with four options: All, Beginner, Intermediate, Advanced
  - **Results Count**: Text showing "Showing X topics" or "X results for '[query]'" when filtered/searched
- **Interactions**:
  - Click view mode button → Re-render topics in selected layout
  - Type in search → Filter topics in real-time (debounced)
  - Click difficulty filter → Show only matching topics
  - Click "Clear filters" → Reset to show all topics
- **States**: Default (all filters off), Filtered (one or more filters active), Searching (search query active), Empty (no results)

**UI-2**: Topic Card (Grid/Card View)
- **Description**: Visual card displaying topic summary in grid or card layout mode.
- **Elements**:
  - **Icon**: Large emoji or icon at top (64x64px minimum)
  - **Topic Name**: Bold title text (16-18px font)
  - **Difficulty Badge**: Colored pill (e.g., green "Beginner", yellow "Intermediate", red "Advanced")
  - **Word Count**: Small text with icon (e.g., "120 words")
  - **Description**: 2-line truncated text with "..." if longer
  - **Hover Overlay** (optional): Subtle shadow, scale transform, or overlay with "View Details" text
- **Interactions**:
  - Click anywhere on card → Navigate to Topic Detail screen
  - Hover → Show hover state (shadow, scale, cursor pointer)
  - Focus (keyboard) → Show focus outline for accessibility
- **States**: Default, Hover, Focus, Loading (skeleton)

**UI-3**: Topic List Item (List View)
- **Description**: Horizontal row displaying topic information in compact list format.
- **Elements**:
  - **Icon**: Medium emoji or icon on left (40x40px)
  - **Topic Name**: Bold title text
  - **Description**: Single-line or full description (not truncated in list view)
  - **Difficulty Badge**: Small pill next to name
  - **Word Count**: Text on right side (e.g., "120 words")
  - **Chevron Icon**: Right-pointing arrow on far right indicating clickability
- **Interactions**:
  - Click anywhere on row → Navigate to Topic Detail screen
  - Hover → Highlight row background (subtle color change)
  - Keyboard navigation → Arrow keys move focus between items, Enter/Space to select
- **States**: Default, Hover, Focus, Selected

**UI-4**: Empty State
- **Description**: Friendly message displayed when no topics match current filters or search.
- **Elements**:
  - **Illustration**: Simple graphic (e.g., empty box, magnifying glass)
  - **Title**: "No topics found" or "No topics available yet"
  - **Message**: Context-specific explanation (e.g., "Try different keywords" or "Check back soon")
  - **Action Button**: "Clear filters" or "Clear search" (if applicable)
- **Interactions**:
  - Click action button → Reset filters/search to show all topics
- **States**: No Results (filtered), No Topics (empty database)

**UI-5**: Loading State
- **Description**: Skeleton screens displayed while topics are being fetched from server.
- **Elements**:
  - **Skeleton Cards**: Gray placeholder rectangles matching card/list layout
  - **Shimmer Effect**: Animated gradient sweep indicating loading
  - **Count**: 6-8 skeleton placeholders visible initially
- **Interactions**:
  - None (non-interactive until data loads)
- **States**: Loading, Error (if fetch fails)

### Business Rules

**BR-1**: Topic Visibility
- **Description**: Only published topics shall be visible to students; unpublished topics are hidden from list.
- **Conditions**: When fetching topics, filter by `is_published = true` for student users
- **Actions**: 
  - Students see only published topics
  - Teachers/Admins can see unpublished topics with "Draft" indicator (in future admin view)

**BR-2**: Default Sorting
- **Description**: Topics shall be displayed in a consistent, predictable order for easier navigation.
- **Conditions**: When no search query is active
- **Actions**: 
  - Primary sort: `display_order` (ascending)
  - Secondary sort: `name` (alphabetical A-Z)
  - Topics with same display_order are alphabetized

**BR-3**: Search Relevance Ranking
- **Description**: When users search, most relevant results shall appear first.
- **Conditions**: When search query is active (length ≥ 2 characters)
- **Actions**: 
  - Exact name matches rank highest
  - Name contains query ranks higher than description matches
  - Case-insensitive matching
  - Results sorted by relevance score, then alphabetically

**BR-4**: Level Badge Color Coding
- **Description**: Difficulty levels shall have consistent visual styling across all views for instant recognition.
- **Conditions**: Always (any view mode)
- **Actions**: 
  - Beginner: Green badge (e.g., `bg-green-100 text-green-700`)
  - Intermediate: Yellow/Orange badge (e.g., `bg-yellow-100 text-yellow-700`)
  - Advanced: Red badge (e.g., `bg-red-100 text-red-700`)
  - Use Shadcn UI Badge component with consistent styling

---

## Non-Functional Requirements

### Performance

- **Page Load**: Topic List screen loads and displays skeleton within 500ms, actual data within 2 seconds on standard connection
- **Search Response**: Search filtering completes within 100ms (client-side filtering); debounced by 300ms to avoid excessive re-renders
- **View Mode Switch**: Switching between grid/card/list completes instantly (<50ms) with smooth transition
- **Responsive Rendering**: Layout reflows smoothly on window resize without jank (60fps)
- **Data Pagination**: If topic count exceeds 50, implement infinite scroll or pagination to maintain performance

### Security

- **Authentication**: Topic List is accessible to all authenticated students (JWT token required)
- **Authorization**: Only published topics visible to students; unpublished topics require Teacher/Admin role (future)
- **Input Sanitization**: Search queries sanitized to prevent XSS attacks
- **Rate Limiting**: API endpoint rate-limited to prevent abuse (max 60 requests/minute per user)

### Accessibility

- **WCAG 2.1 AA Compliance**: All interactive elements meet accessibility standards
- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Space, Arrow keys) to browse and select topics
- **Screen Reader Support**: Proper ARIA labels and semantic HTML for all UI elements
- **Focus Management**: Clear focus indicators on all interactive elements
- **Color Contrast**: Difficulty badges and text meet 4.5:1 contrast ratio minimum
- **Alternative Text**: Icons have descriptive text alternatives

### Usability

- **Intuitive Navigation**: Users can browse and select topics with zero training
- **Mobile-First Design**: Touch-friendly targets (min 44x44px), swipe gestures, optimal spacing
- **Visual Hierarchy**: Important information (topic name, level) is prominent; secondary info (word count) is subtle
- **Consistent Layout**: View mode preference persisted; filters/search state preserved during navigation
- **Fast Interaction**: No unnecessary clicks or steps to get to topic detail or start learning

---

## Success Criteria

### Quantitative Metrics

- **Discovery Speed**: 90% of users find a relevant topic within 30 seconds of landing on Topic List
- **Engagement**: 70% of users click on at least one topic to view details
- **Search Usage**: 30% of users utilize search feature to find topics faster
- **Mobile Usage**: 40% of topic browsing occurs on mobile devices with smooth interaction
- **Load Performance**: 95% of page loads complete within 2 seconds

### Qualitative Measures

- **Ease of Use**: Users report topic browsing is intuitive and requires no guidance
- **Visual Appeal**: Users find the layout attractive and professional (positive feedback in surveys)
- **Relevance**: Students can quickly identify topics matching their interests or goals
- **No Confusion**: Zero support tickets related to "can't find topics" or "don't understand topic organization"

---

## Scope

### In Scope

- Displaying all published topics in three view modes (grid, card, list)
- Filtering topics by difficulty level (Beginner, Intermediate, Advanced)
- Searching topics by name and description keywords
- Navigation from Topic List to Topic Detail screen
- Responsive design for desktop, tablet, and mobile
- Loading and empty states with friendly messaging
- Saving user's view mode preference
- Basic topic metadata (icon, name, description, level, word count)

### Out of Scope

- **Topic CRUD Operations**: Creating, editing, or deleting topics (Admin feature - separate spec)
- **Advanced Filtering**: Filtering by multiple criteria simultaneously (e.g., level + skill type + duration)
- **Topic Sorting Options**: Custom sorting (e.g., by popularity, newest, alphabetical) - user controls only view mode
- **Favorites/Bookmarks**: Saving favorite topics for quick access (future enhancement)
- **Progress Indicators**: Showing completion percentage per topic (requires progress tracking feature)
- **Topic Recommendations**: AI-suggested topics based on user history (future enhancement)
- **Multi-language Support**: Translating topic names/descriptions to user's preferred language
- **Offline Access**: Caching topics for offline browsing

### Future Considerations

- **Personalized Recommendations**: "Recommended for you" section based on user level and past activity
- **Topic Categories/Tags**: Grouping topics into broader categories (e.g., "Travel & Tourism", "Professional English")
- **Sorting Options**: Allow users to sort by popularity, newest, alphabetical, or estimated time
- **Favorites/Bookmarks**: Star favorite topics for quick access on homepage
- **Progress Overlay**: Show completion ring or percentage on topics user has started
- **Related Topics**: "If you liked this, try these" suggestions on Topic Detail screen
- **Topic Previews**: Hover to see tooltip with sample words or quick stats
- **Bulk Actions**: Select multiple topics to add to a learning plan or export

---

## Dependencies

### Internal Dependencies

- **Authentication System**: JWT authentication must be implemented to protect Topic List route
- **User Profile**: User preferences (view mode, level) may be stored in user profile (optional - can use localStorage initially)
- **Topic Data Service**: Backend API endpoint `GET /api/topics` must return topic data with all required fields

### External Dependencies

- **Shadcn UI Components**: Badge, Card, Input, Button, Skeleton, EmptyState components
- **TanStack Query**: For data fetching, caching, and loading states
- **TanStack Router**: For navigation to Topic Detail screen with route params
- **Lucide Icons** (or Radix Icons): For UI icons (search, grid, card, list, chevron)

---

## Assumptions

- Topics are relatively stable (not changing frequently), so aggressive caching (5-minute staleTime) is acceptable
- Most users will browse topics visually rather than searching (search is secondary feature)
- English learners prefer visual organization (icons, colors) over dense text lists
- Mobile users are equally important as desktop users (40-50% mobile traffic expected)
- Initial topic catalog will have 20-50 topics at launch; pagination not needed initially
- Topic icons are provided as emoji characters (Unicode) rather than uploaded images (simpler implementation)
- Each topic belongs to exactly one difficulty level (no multi-level topics)
- Word count is pre-calculated and stored (not computed on-demand)
- Users access this screen from main navigation or homepage (breadcrumb reflects this)

---

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation Strategy |
| ---- | ------ | ---------- | -------------------- |
| Large number of topics (100+) causes slow page load | High | Medium | Implement pagination or infinite scroll; lazy load images; use client-side filtering for search |
| Emoji icons don't render consistently across devices | Medium | Medium | Provide fallback text or use icon library (Lucide/Radix) instead of emoji; test on iOS/Android/Windows |
| Users overwhelmed by too many topics | Medium | Low | Implement smart filtering/categories; add "Popular" or "Recommended" sections; guide new users with onboarding |
| Mobile users struggle with small touch targets | High | Low | Follow 44x44px minimum touch target guideline; test on real devices; use generous spacing |
| Search doesn't find expected topics (poor relevance) | Medium | Medium | Implement fuzzy matching or synonym expansion; log search queries to identify patterns; iterate on algorithm |
| Network latency causes poor UX (slow loading) | High | Medium | Implement skeleton screens; prefetch topics on homepage; cache aggressively with TanStack Query; retry failed requests |

---

## Constitutional Compliance

### Applicable Principles

- **Principle 1 - Technology Stack Integrity**: Feature uses React 19+, Shadcn UI components (Badge, Card, Input, Skeleton), TanStack Router for navigation, TanStack Query for data fetching, Zustand for view mode preference persistence (if global), adhering to approved stack.

- **Principle 2 - Modular Architecture**: Feature organized as `features/topics/` module with:
  - `pages/TopicListPage.tsx` (route component)
  - `components/TopicCard.tsx`, `TopicListItem.tsx`, `TopicFilters.tsx`, `TopicSearch.tsx`
  - `hooks/useTopics.ts` (TanStack Query hook), `useTopicFilters.ts`
  - `services/topics.api.ts` (Axios API functions)
  - `stores/topicViewPreferences.store.ts` (Zustand store for view mode)
  - `types/topic.types.ts` (TypeScript interfaces)
  - Lazy-loaded via TanStack Router route tree

- **Principle 3 - Type Safety First**: All data structures have TypeScript interfaces:
  - `Topic` interface with explicit types for all fields
  - `TopicLevel` enum (`'beginner' | 'intermediate' | 'advanced'`)
  - `ViewMode` enum (`'grid' | 'card' | 'list'`)
  - API response types matching backend DTOs
  - No `any` types; strict mode enabled

- **Principle 4 - Comprehensive Validation**: 
  - Frontend: Search input sanitized; filter values validated against enum
  - Backend: Topic DTO validated with class-validator (`@IsString()`, `@IsEnum()`, `@Min(0)`, etc.)
  - Database: `CHECK` constraints on `level` enum, `NOT NULL` on required fields, `UNIQUE` on name/slug

- **Principle 5 - Secure Authentication & Authorization**: 
  - Route protected with JWT auth guard (redirect to login if unauthenticated)
  - API endpoint checks JWT token; only returns published topics for students
  - Search queries sanitized to prevent XSS
  - Rate limiting on `/api/topics` endpoint

- **Principle 6 - Four Skills Implementation Standards**: 
  - Topics support all four skills via `related_skills` field (e.g., a "Travel" topic may have reading articles, listening dialogues, speaking prompts)
  - Consistent card/list patterns reusable across Reading/Writing/Speaking/Listening modules
  - Difficulty levels (Beginner/Intermediate/Advanced) align with CEFR A1-C2 mapping

- **Principle 7 - Error Handling & Observability**: 
  - TanStack Query error handling with `onError` callback; displays toast on API failure
  - Axios interceptor catches 401 (redirect to login), 403 (access denied), 500 (generic error)
  - Error Boundary wraps TopicListPage to catch React rendering errors
  - Sonner toast notifications for user feedback
  - Backend logs all errors with correlation IDs

- **Principle 8 - Testing Discipline**: 
  - Unit tests: TopicCard, TopicListItem, useTopics hook, topic filters/search logic (≥80% coverage)
  - Integration tests: Full TopicListPage with mocked API responses (MSW)
  - E2E test (Playwright): Navigate to topic list, switch view modes, search, filter, click topic
  - Accessibility tests: `jest-axe` for WCAG compliance

- **Principle 9 - Performance & Scalability**: 
  - TanStack Router lazy-loads TopicList feature (code splitting)
  - TanStack Query caches topics (5-minute staleTime); avoids redundant requests
  - React.memo() on TopicCard and TopicListItem to prevent unnecessary re-renders
  - Debounced search input (300ms) to reduce re-render frequency
  - Skeleton screens improve perceived performance
  - Backend indexes on `is_published`, `level`, `display_order` for fast queries

- **Principle 10 - Documentation & Context7 Integration**: 
  - TSDoc comments on all exported functions, hooks, and components
  - OpenAPI documentation for `GET /api/topics` endpoint with response schema
  - Context7 references:
    - `/tanstack/query` - useQuery for data fetching
    - `/tanstack/router` - Link component and navigation
    - `/radix-ui/primitives` - Shadcn UI components (Badge, Card, Input)
    - `/tailwindlabs/tailwindcss` - Responsive utilities

---

## Appendix

### Glossary

- **Topic**: A thematic grouping of vocabulary words (e.g., "Food & Dining", "Travel & Tourism") that provides context for learning
- **View Mode**: Display layout preference (grid, card, or list) for browsing topics
- **Difficulty Level**: Classification of topic complexity: Beginner (A1-A2), Intermediate (B1-B2), Advanced (C1-C2)
- **Published Topic**: Topic visible to students (is_published = true); unpublished topics are drafts
- **Skeleton Screen**: Placeholder UI (gray rectangles) displayed while content loads

### References

- [Shadcn UI Components](https://ui.shadcn.com/) - Badge, Card, Input, Skeleton components
- [TanStack Query Documentation](https://tanstack.com/query) - Data fetching patterns
- [TanStack Router Documentation](https://tanstack.com/router) - File-based routing
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility standards
- [Context7: /radix-ui/primitives] - Radix UI primitives for accessible components

---

**Notes**:
- This specification focuses on the student-facing browse experience; admin CRUD operations will be a separate spec
- All UI decisions (colors, spacing, typography) follow EnglishMaster design system (to be documented)
- Success criteria are measurable via analytics (time-on-page, click-through rate, search usage)
- No implementation details included; technical decisions left to planning/implementation phase

