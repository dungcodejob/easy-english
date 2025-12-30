import { QUERY_KEYS } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import { useWorkspaceStore } from '../stores/workspace.store';



export const useWorkspaces = () => {
  const { fetchWorkspaces } = useWorkspaceStore();


  return  useQuery({
    queryKey: [QUERY_KEYS.WORKSPACE],
    queryFn: async () => {
      const result = await fetchWorkspaces();

      if(result.isErr()) {
        throw result.error;
      }

      return result.value.items;
    },
  });

};
