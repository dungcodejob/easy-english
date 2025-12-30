import { QUERY_KEYS } from "@/shared/constants";
import { useErrorHandler } from "@/shared/hooks/use-error-handler";
import type { TypeSafe } from "@/shared/types";
import { toast } from '@/shared/utils/toast';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useWorkspaceStore } from "../stores/workspace.store";
import type { CreateWorkspaceDto } from "../types/workspace.types";

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
   const { createWorkspace } = useWorkspaceStore();

  const { handleError } = useErrorHandler();

  const mutation = useMutation({
    mutationFn: async (data: CreateWorkspaceDto) => {
      const result = await createWorkspace(data);
      
      if (result.isErr()) {
        throw result.error;
      }

      return result.value.data;
    },
    onSuccess: () => {
      // Invalidate and refetch topics list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKSPACE] });
     
    },
    onError: (error) => {
      // Use the global error handler for backend/network errors
      // Validation errors should be handled by the form component via useValidationErrors
      handleError(error as TypeSafe); 
    },
  })

    return {
      ...mutation,
      mutateAsync: (data: CreateWorkspaceDto) =>
        toast.promise(mutation.mutateAsync(data), {
          loading: t('workspace.create.creating'),
          success: t('workspace.create.success'),
          error: t('workspace.create.error'),
        }),
    };


};