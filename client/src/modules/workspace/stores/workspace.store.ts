import type { AppError } from '@/shared/lib/errors/app-error';
import { STORAGE_KEYS } from '@shared/constants';
import type { Result } from 'neverthrow';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { workspaceApi } from '../services/workspace.api';
import type { CreateWorkspaceDto, Workspace } from '../types/workspace.types';

type WorkspaceState = {
  currentWorkspaceId: string | null;
  workspaces: Workspace[];
};

type WorkspaceActions = {
  setCurrentWorkspaceId: (id: string | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  fetchWorkspaces: () => Promise<Result<{ items: Workspace[]; meta: { count: number } }, AppError>>;
  createWorkspace: (data: CreateWorkspaceDto) => Promise<Result<{ data: Workspace }, AppError>>;
  reset: () => void;
};

type WorkspaceStore = WorkspaceState & WorkspaceActions;

const initialState: WorkspaceState = {
  currentWorkspaceId: null,
  workspaces: [],
};

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentWorkspaceId: (id) => set({ currentWorkspaceId: id }),

      setWorkspaces: (workspaces) => set({ workspaces }),

      fetchWorkspaces: async () => {
        const result = await workspaceApi.getAll();

        if (result.isOk()) {

          const workspaces = result.value.items;
          const currentId = get().currentWorkspaceId;

          let nextCurrentId = currentId;

          if (workspaces.length === 0) {
            nextCurrentId = null;
          } else {
            // Check if current ID is valid
            const isValid = currentId && workspaces.some(w => w.id === currentId);

            // If invalid or not set, auto-select first
            if (!isValid) {
              nextCurrentId = workspaces[0].id;
            }
          }

          set({
            workspaces,
            currentWorkspaceId: nextCurrentId,
          });

        }

        return result;

      },

      createWorkspace: async (data) => {

        const result = await workspaceApi.create(data);

        if (result.isOk()) {
          const newWorkspace = result.value.data;
          set(state => ({
            workspaces: [...state.workspaces, newWorkspace],
            currentWorkspaceId: newWorkspace.id,
          }));

        }


        return result;
     
      },

      reset: () => set(initialState),
    }),
    {
      name: STORAGE_KEYS.WORKSPACE,
      storage: createJSONStorage(() => localStorage),
      
      // Only persist currentWorkspaceId
      partialize: (state) => ({ currentWorkspaceId: state.currentWorkspaceId }),
    },
  ),
);
