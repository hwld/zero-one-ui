import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "./button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  confirmText: string;
  children: ReactNode;
};

export const ConfirmDialog: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  confirmText,
  children,
}) => {
  const isPrecent = useIsPresent();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isPrecent && isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </DialogOverlay>
            <DialogContent asChild aria-describedby={undefined}>
              <motion.div
                className="fixed top-1/2 left-1/2 w-full max-w-[500px] overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-100"
                initial={{ opacity: 0, x: "-50%", y: "-60%" }}
                animate={{ opacity: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, x: "-50%", y: "-60%" }}
              >
                <DialogTitle className="p-4">{title}</DialogTitle>
                <div className="min-h-[100px] px-4 pb-4 text-sm">
                  {children}
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-zinc-700 bg-black/30 p-4">
                  <Button variant="ghost" onClick={() => onOpenChange(false)}>
                    キャンセルする
                  </Button>
                  <Button onClick={onConfirm}>{confirmText}</Button>
                </div>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
