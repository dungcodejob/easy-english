
import { ConfirmationDialog } from '@/shared/ui/common';
import { Badge } from '@/shared/ui/shadcn/badge';
import { RiBookmarkLine, RiGlobalLine, RiMoreLine, RiPencilLine } from '@remixicon/react';
import { Button } from '@shared/ui/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/ui/shadcn/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/shadcn/dropdown-menu';
import { Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useDeleteTopic, useDuplicateTopic, useShareTopic } from '../hooks';
import { formatLanguagePair, type Topic } from '../types';
import { TopicDialog } from './topic-dialog';

interface TopicCardProps {
  topic: Topic;
}



export function TopicCard({ topic }: TopicCardProps) {
  const deleteTopic = useDeleteTopic();
  const shareTopic = useShareTopic();
  const duplicateTopic = useDuplicateTopic();

  const languagePairLabel = useMemo(() => formatLanguagePair(topic.languagePair), [topic.languagePair]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteTopic.mutateAsync(topic.id);
    setIsDeleteDialogOpen(false);
  };

  const handleShare = () => {
    shareTopic.mutateAsync(topic.id);
  };

  const handleDuplicate = () => {
    duplicateTopic.mutateAsync(topic.id);
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <Link
        to="/topic/$topicId"
        params={{ topicId: topic.id }}
        className="block"
      >
        <Card className="hover:shadow-md cursor-pointer group">

        {/* Cover Image */}
        {topic.coverImageUrl && (
          <div className="relative w-full h-32 overflow-hidden rounded-t-xl">
            <img
              src={topic.coverImageUrl}
              alt={topic.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2">{topic.name}</CardTitle>
            
            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <RiMoreLine className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  handleShare();
                }}>
                  <RiGlobalLine className="mr-2 h-4 w-4" />
                  {topic.isPublic ? 'Copy Share Link' : 'Share'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  handleEdit();
                }}>
                  <RiPencilLine className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  handleDuplicate();
                }}>
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardDescription className="line-clamp-2">
              {topic.description || 'No description'}
            </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Category and Language badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{topic.category}</Badge>
            <Badge variant="outline">{languagePairLabel}</Badge>
            {topic.isPublic && (
              <Badge variant="default">
                <RiGlobalLine className="mr-1 h-3 w-3" />
                Public
              </Badge>
            )}
          </div>

          {/* Tags */}
          {topic.tags && topic.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {topic.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {topic.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{topic.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <RiBookmarkLine className="mr-1 h-4 w-4" />
            <span>{topic.wordCount} words</span>
          </div>
        </CardFooter>
      
      </Card>
      </Link>
      <TopicDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        topic={topic}
      />
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        variant="destructive"
        title="Delete Topic"
        description={`Are you sure you want to delete "${topic.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        isLoading={deleteTopic.isPending}
      />
    </>
  );
}
