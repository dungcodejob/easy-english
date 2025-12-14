import { Badge } from '@/shared/ui/shadcn/badge';
import { Input } from '@/shared/ui/shadcn/input';
import { cn } from '@/shared/utils';
import { RiCloseLine } from '@remixicon/react';
import * as React from 'react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  maxTags?: number;
}

export function TagInput({
  value = [],
  onChange,
  placeholder = 'Type and press Enter to add tags...',
  className,
  maxTags,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      
      // Check if tag already exists
      if (value.includes(inputValue.trim())) {
        return;
      }

      // Check max tags limit
      if (maxTags && value.length >= maxTags) {
        return;
      }

      onChange([...value, inputValue.trim()]);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag when backspace is pressed with empty input
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-0.5 rounded-full hover:bg-muted"
              >
                <RiCloseLine className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      {maxTags && (
        <p className="text-xs text-muted-foreground">
          {value.length} / {maxTags} tags
        </p>
      )}
    </div>
  );
}
