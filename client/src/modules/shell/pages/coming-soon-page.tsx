import { Construction } from 'lucide-react';
import type { ReactNode } from 'react';

interface ComingSoonPageProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function ComingSoonPage({ 
  title, 
  description = 'This feature is under development and will be available soon.',
  icon 
}: ComingSoonPageProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          {icon || (
            <div className="rounded-full bg-primary/10 p-6">
              <Construction className="h-12 w-12 text-primary" />
            </div>
          )}
        </div>
        
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          {title}
        </h1>
        
        <p className="mb-8 text-muted-foreground">
          {description}
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2">
            <p className="text-sm font-medium text-primary">
              🚧 Coming Soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
