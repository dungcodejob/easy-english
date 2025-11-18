import { RiDeleteBinLine } from '@remixicon/react';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { DropdownMenuItem } from './ui/dropdown-menu';

type RowActionDeleteProps = {
  buttonLabel?: string;
  modalTitle?: string;
  modalDescription?: string;
  onConfirm: () => void;
};

export const RowActionDelete = forwardRef<HTMLDivElement, RowActionDeleteProps>(
  ({ buttonLabel, modalTitle, modalDescription, onConfirm }, ref) => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    return (
      <AlertDialog defaultOpen={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            ref={ref}
          >
            <RiDeleteBinLine />
            {buttonLabel || t('common.delete')}
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {modalTitle || t('common.delete_confirmation')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {modalDescription || t('common.delete_confirmation_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>
              {t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    // return (
    //     <Modal.Root open={open} onOpenChange={setOpen}>
    //         <Modal.Trigger asChild>
    //             <Dropdown.Item
    //                 className="text-red-500"
    //                 onClick={(e) => {
    //                     e.preventDefault();
    //                     setOpen(true);
    //                 }}
    //                 ref={ref}
    //             >
    //                 <Dropdown.ItemIcon as={RiDeleteBinLine} className="text-red-500" />
    //                 {buttonLabel || t('delete')}
    //             </Dropdown.Item>
    //         </Modal.Trigger>
    //         <Modal.Content className="max-w-[440px]">
    //             <VisuallyHidden>
    //                 <DialogTitle>{modalTitle || t('delete_confirmation')}</DialogTitle>
    //                 <DialogDescription>
    //                     {modalDescription || t('delete_confirmation_description')}
    //                 </DialogDescription>
    //             </VisuallyHidden>

    //             <Modal.Body className="flex items-start gap-4">
    //                 <div className="rounded-10 bg-error-lighter flex size-10 shrink-0 items-center justify-center">
    //                     <RiDeleteBinLine className="text-error-base size-6" />
    //                 </div>
    //                 <div className="space-y-1">
    //                     <div className="text-label-md text-text-strong-950">
    //                         {modalTitle || t('delete_confirmation')}
    //                     </div>
    //                     <div className="text-paragraph-sm text-text-sub-600">
    //                         {modalDescription || t('delete_confirmation_description')}
    //                     </div>
    //                 </div>
    //             </Modal.Body>
    //             <Modal.Footer>
    //                 <Modal.Close asChild>
    //                     <Button.Root
    //                         variant="neutral"
    //                         mode="stroke"
    //                         size="small"
    //                         className="w-full"
    //                     >
    //                         {t('cancel')}
    //                     </Button.Root>
    //                 </Modal.Close>
    //                 <Button.Root size="small" className="w-full" onClick={onConfirm}>
    //                     {t('confirm')}
    //                 </Button.Root>
    //             </Modal.Footer>
    //         </Modal.Content>
    //     </Modal.Root>
    // );
  },
);
