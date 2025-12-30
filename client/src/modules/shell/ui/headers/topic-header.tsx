import { FolderOpen } from 'lucide-react';

export interface TopicHeaderProps {
  topicName: string;
  totalWords: number;
  learning: number;
  mastered: number;
}

export function TopicHeader({ topicName, totalWords, learning, mastered }: TopicHeaderProps) {
  return (
    <div className="border-b bg-background">
      <div className="container flex h-16 items-center gap-4 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 shadow-sm">
          <FolderOpen className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Topic</h1>
            <span className="text-sm text-muted-foreground">· {topicName}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {totalWords} words · {learning} learning · {mastered} mastered
          </p>
        </div>
      </div>
    </div>
  );
}
