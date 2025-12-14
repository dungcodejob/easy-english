import { QueryProvider } from './query-context';
import { ThemeProvider } from './theme-context';
export * from './query-context';
export * from './theme-context';

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  );
};
