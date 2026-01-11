export enum Language {
  EN = 'en',
  VI = 'vi',
  ES = 'es',
  FR = 'fr',
  DE = 'de',
  JA = 'ja',
  KO = 'ko',
  ZH = 'zh',
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  language: Language;
  userId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  language: Language;
}

export interface UpdateWorkspaceDto extends Partial<CreateWorkspaceDto> {}

export enum WorkspaceType {
  PERSONAL = 'personal',
  TEAM = 'team',
  CLASSROOM = 'classroom',
}

export enum LearningGoal {
  VOCABULARY = 'vocabulary',
  EXAM_PREP = 'exam_prep',
  DAILY_PRACTICE = 'daily_practice',
}

export enum LearningLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum LearningMode {
  FLASHCARD = 'flashcard',
  QUIZ = 'quiz',
  SPACED_REPETITION = 'spaced_repetition',
}

export interface CreateWorkspaceWizardData {
  // Step 1: Basics
  name: string;
  workspaceType: WorkspaceType;
  description?: string;
  
  // Step 2: Learning Context
  language: Language;
  learningGoal?: LearningGoal;
  level?: LearningLevel;
  
  // Step 3: Preferences (optional)
  dailyTarget?: number;
  studyReminder?: boolean;
  defaultLearningMode?: LearningMode;
}
