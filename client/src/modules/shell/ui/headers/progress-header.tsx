import { TrendingUp } from 'lucide-react';

export interface ProgressHeaderProps {
  language: string;
  streak: number;
  masteredPercentage: number;
}

export function ProgressHeader({ language, streak, masteredPercentage }: ProgressHeaderProps) {
  return (
    <div className="border-b bg-background">
      <div className="container flex h-16 items-center gap-4 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-green-500 to-emerald-500 shadow-sm">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Progress</h1>
            <span className="text-sm text-muted-foreground">· {language}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {streak}-day streak · {masteredPercentage}% mastered
          </p>
        </div>
      </div>
    </div>
  );
}
