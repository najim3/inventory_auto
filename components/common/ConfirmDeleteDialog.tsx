"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ConfirmDeleteDialogProps {
  onConfirm: (formData: FormData) => void | Promise<void>;
  triggerText?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function ConfirmDeleteDialog({
  onConfirm,
  triggerText = "Delete",
  title = "Are you sure?",
  description = "This action cannot be undone.",
  children,
}: ConfirmDeleteDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-red-600 border-red-500 hover:bg-red-50"
        >
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          action={async (formData) => {
            await onConfirm(formData);
            setOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive">
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
