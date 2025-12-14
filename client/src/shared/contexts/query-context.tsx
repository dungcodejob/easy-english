import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MINUTE } from '../constants';

// Create a logger function
const logger = {
  log: (...args: unknown[]) => {
    console.log('📘 [Query Log]:', ...args);
  },
  warn: (...args: unknown[]) => {
    console.warn('⚠️ [Query Warning]:', ...args);
  },
  error: (...args: unknown[]) => {
    console.error('❌ [Query Error]:', ...args);
  },
};

// Create query client with error logging
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      staleTime: 2 * MINUTE,
      gcTime: 15 * MINUTE,
      retry: 1, // Only retry once on failure
    },
    mutations: {
      retry: 1,
    },
  },
});

// Add global error handlers
queryClient.getQueryCache().subscribe((event) => {
  if (event.query.state.status === 'error') {
    logger.error('Query Error:', event.query.state.error);
  }
});

queryClient.getMutationCache().subscribe((event) => {
  const mutation = event.mutation;
  if (mutation?.state.status === 'error') {
    logger.error('Mutation Error:', mutation.state.error);
  }
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
    </QueryClientProvider>
  );
};
