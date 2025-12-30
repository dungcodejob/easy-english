/**
 * Fake API hooks for header data
 * These will be replaced with real API calls later
 */

import { useWorkspaceStore } from '@/modules/workspace/stores/workspace.store';
import { useMemo } from 'react';

export interface ReviewHeaderData {
  dueCount: number;
  estimatedMinutes: number;
  language: string;
}

export interface LearnHeaderData {
  mode: string;
  topicName: string;
  progress?: {
    current: number;
    total: number;
  };
}

export interface TopicHeaderData {
  topicName: string;
  totalWords: number;
  learning: number;
  mastered: number;
}

export interface ProgressHeaderData {
  language: string;
  streak: number;
  masteredPercentage: number;
}

/**
 * Hook to get SRS review stats (fake data)
 */
export function useReviewStats(): ReviewHeaderData {
  const { workspaces, currentWorkspaceId } = useWorkspaceStore();
  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);

  return useMemo(() => ({
    dueCount: 3,
    estimatedMinutes: 5,
    language: currentWorkspace?.language || 'EN',
  }), [currentWorkspace?.language]);
}

/**
 * Hook to get learn session data (fake data)
 */
export function useLearnSession(_topicId?: string): LearnHeaderData {
  return useMemo(() => ({
    mode: 'Flashcards',
    topicName: 'IELTS Vocabulary',
    progress: {
      current: 5,
      total: 20,
    },
  }), []);
}

/**
 * Hook to get topic stats (fake data)
 */
export function useTopicStats(_topicId: string): TopicHeaderData {
  return useMemo(() => ({
    topicName: 'Daily Conversation',
    totalWords: 32,
    learning: 8,
    mastered: 12,
  }), []);
}

/**
 * Hook to get progress stats (fake data)
 */
export function useProgressStats(): ProgressHeaderData {
  const { workspaces, currentWorkspaceId } = useWorkspaceStore();
  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);

  return useMemo(() => ({
    language: currentWorkspace?.language || 'EN',
    streak: 14,
    masteredPercentage: 67,
  }), [currentWorkspace?.language]);
}
