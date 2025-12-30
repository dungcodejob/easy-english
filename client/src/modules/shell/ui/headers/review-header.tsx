import { Flame } from 'lucide-react';

export interface ReviewHeaderProps {
  dueCount: number;
  estimatedMinutes: number;
  language: string;
}

export function ReviewHeader({ dueCount, estimatedMinutes, language }: ReviewHeaderProps) {
  return (
    <div className="border-b bg-background">
      <div className="container flex h-16 items-center gap-4 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-red-500 shadow-sm">
          <Flame className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Today Review</h1>
            <span className="text-sm text-muted-foreground">· {language}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {dueCount} words due · ~{estimatedMinutes} minutes
          </p>
        </div>
      </div>
    </div>
  );
}
