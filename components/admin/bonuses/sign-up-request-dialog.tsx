"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormInputTopLabel } from "@/components/ui/form-input";
import { useCreateSignupBonusRequest } from "@/hooks/mutation/useCreateSignupBonusRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signupBonusRequestSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
});

type SignupBonusRequestFormData = z.infer<typeof signupBonusRequestSchema>;

interface SignUpRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpRequestDialog({
  isOpen,
  onClose,
}: SignUpRequestDialogProps) {
  const { handleCreateSignupBonusRequest, isPending, isSuccess } = useCreateSignupBonusRequest();

  const form = useForm<SignupBonusRequestFormData>({
    resolver: zodResolver(signupBonusRequestSchema),
    defaultValues: {
      customerId: "",
    },
  });

  const handleSubmit = (data: SignupBonusRequestFormData) => {
    handleCreateSignupBonusRequest({ customerId: data.customerId });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Close dialog and reset form on success
  useEffect(() => {
    if (isSuccess) {
      form.reset();
      onClose();
    }
  }, [isSuccess, onClose, form]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Sign Up Bonus Request</DialogTitle>
          <DialogDescription>
            Enter the customer ID to create a sign up bonus request.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormInputTopLabel
              control={form.control}
              name="customerId"
              label="Customer ID"
              placeholder="Enter customer ID"
              required
            />

            <DialogFooter className="flex justify-start gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
                className="p-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-theme-dark-green hover:bg-theme-dark-green/90 text-white p-6"
                disabled={isPending}
                isLoading={isPending}
                loadingText="Creating..."
              >
                Create Request
              </Button>

            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
