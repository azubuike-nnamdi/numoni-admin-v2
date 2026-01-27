'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Settings } from 'lucide-react';
import { useState } from 'react';

interface MakeDealInternalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (isInternal: boolean) => void;
  dealName: string;
  isLoading?: boolean;
}

export default function MakeDealInternalDialog({
  isOpen,
  onClose,
  onConfirm,
  dealName,
  isLoading = false,
}: Readonly<MakeDealInternalDialogProps>) {
  const [isInternal, setIsInternal] = useState<string>('no');

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm(isInternal === 'yes');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Settings className="h-6 w-6 text-theme-dark-green" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold text-gray-900">
            Make Deal Internal
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Select whether you want to make <span className="font-semibold">{dealName}</span> an internal deal.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex justify-center">
          <RadioGroup
            value={isInternal}
            onValueChange={setIsInternal}
            className="flex flex-row gap-8"
            disabled={isLoading}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto bg-theme-dark-green hover:bg-theme-dark-green/90 text-white"
            isLoading={isLoading}
            loadingText="Submitting..."
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
