import { GraduationCap } from 'lucide-react';

export interface LearnHeaderProps {
  mode: string;
  topicName: string;
  progress?: {
    current: number;
    total: number;
  };
}

export function LearnHeader({ mode, topicName, progress }: LearnHeaderProps) {
  return (
    <div className="border-b bg-background">
      <div className="container flex h-16 items-center gap-4 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-500 shadow-sm">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Learn</h1>
            <span className="text-sm text-muted-foreground">· {mode}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Topic: {topicName}
            {progress && (
              <span className="ml-2">
                ({progress.current}/{progress.total})
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
