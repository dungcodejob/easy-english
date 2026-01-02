import { Button } from '@/shared/ui/shadcn/button';
import { FolderOpen, Plus } from 'lucide-react';

export interface TopicListHeaderProps {
  onCreateClick: () => void;
}

export function TopicListHeader({ onCreateClick }: TopicListHeaderProps) {
  return (
    <div className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border   shadow-sm">
            <FolderOpen className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Topics</h1>
            <p className="text-sm text-muted-foreground">
              Organize your vocabulary into topics
            </p>
          </div>
        </div>
        <Button onClick={onCreateClick} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Topic
        </Button>
      </div>
    </div>
  );
}
