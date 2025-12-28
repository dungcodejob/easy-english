import { ConfirmationDialog } from '@/shared/ui/common/confirmation-dialog';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog';
import { Label } from '@/shared/ui/shadcn/label';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDeleteWordSense } from '../hooks/use-delete-word-sense';
import { useUpdateWordSense } from '../hooks/use-update-word-sense';
import type { UserWordSense } from '../types/word-sense.types';
import { formValuesToUpdateDto, userWordSenseToFormValues } from '../utils/adapters';
import { SenseEditor, type SenseEditorFormValues } from './sense-editor';

interface EditWordSenseDialogProps {
  wordSense: UserWordSense;
  topicId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditWordSenseDialog({
  wordSense,
  topicId,
  open,
  onOpenChange,
}: EditWordSenseDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const updateWordSense = useUpdateWordSense(topicId);
  const deleteWordSense = useDeleteWordSense(topicId);

  const handleSubmit = async (data: SenseEditorFormValues) => {
    try {
      await updateWordSense.mutateAsync({
        id: wordSense.id,
        data: formValuesToUpdateDto(data),
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWordSense.mutateAsync(wordSense.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DialogTitle>Edit Word Sense</DialogTitle>
                <DialogDescription>
                  Update the details of "{wordSense.word}"
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Read-only fields */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label className="text-xs text-muted-foreground">Word</Label>
              <p className="text-sm font-medium">{wordSense.word}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Language</Label>
              <p className="text-sm font-medium">{wordSense.language.toUpperCase()}</p>
            </div>
          </div>

          {/* Editable fields */}
          <SenseEditor
            initialData={userWordSenseToFormValues(wordSense)}
            readOnlyFields={['word', 'language']}
            onSubmit={handleSubmit}
            isSubmitting={updateWordSense.isPending}
            submitLabel="Save Changes"
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Word Sense"
        description={`Are you sure you want to delete "${wordSense.word}" (${wordSense.partOfSpeech})? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteWordSense.isPending}
      />
    </>
  );
}
