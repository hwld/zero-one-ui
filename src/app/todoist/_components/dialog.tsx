import * as RxDialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { PropsWithChildren, ReactNode, useRef } from "react";
import { IconButton } from "./icon-button";
import { PiXLight } from "@react-icons/all-files/pi/PiXLight";

type DialogProps = {
  trigger?: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  width?: number;
  children: ReactNode;
};

export const Dialog: React.FC<DialogProps> = ({
  trigger,
  isOpen,
  onOpenChange,
  width = 450,
  children,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleOpenAutoFocus = (e: Event) => {
    const target = contentRef.current?.querySelector("[data-auto-focus]");
    if (!target || !(target instanceof HTMLElement)) {
      return;
    }

    e.preventDefault();
    target.focus();
  };

  return (
    <RxDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <RxDialog.Trigger asChild>{trigger}</RxDialog.Trigger>}
      <AnimatePresence>
        {isOpen && (
          <RxDialog.Portal forceMount>
            <RxDialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-30 bg-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              />
            </RxDialog.Overlay>
            <RxDialog.Content
              ref={contentRef}
              style={{ width }}
              asChild
              onOpenAutoFocus={handleOpenAutoFocus}
            >
              <motion.div
                className="fixed inset-[50%] z-40 flex h-min max-h-[90%] w-[500px] flex-col rounded-lg bg-stone-50 text-stone-700 shadow-md outline-hidden"
                initial={{ opacity: 0, y: "-55%", x: "-50%" }}
                animate={{ opacity: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, y: "-55%", x: "-50%" }}
                transition={{ duration: 0.1 }}
              >
                {children}
              </motion.div>
            </RxDialog.Content>
          </RxDialog.Portal>
        )}
      </AnimatePresence>
    </RxDialog.Root>
  );
};

export const DialogHeader: React.FC<
  { withClose?: boolean } & PropsWithChildren
> = ({ children, withClose }) => {
  return (
    <header
      className={clsx(
        "flex items-center pb-2",
        withClose ? "pt-2 pr-2 pl-4" : "px-4 pt-4",
      )}
    >
      {children}
      {withClose && (
        <DialogClose>
          <IconButton icon={PiXLight} />
        </DialogClose>
      )}
    </header>
  );
};

export const DialogContent: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="overflow-auto px-4 py-3 text-sm">{children}</div>;
};

export const DialogFooter: React.FC<PropsWithChildren> = ({ children }) => {
  return <footer className="p-4">{children}</footer>;
};

export const DialogTitle: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <RxDialog.Title className="text-md font-bold">{children}</RxDialog.Title>
  );
};

export const DialogClose: React.FC<PropsWithChildren> = ({ children }) => {
  return <RxDialog.Close asChild>{children}</RxDialog.Close>;
};

export const DialogActions: React.FC<{
  children: ReactNode;
  left?: ReactNode;
}> = ({ children, left }) => {
  return (
    <div className="flex items-center justify-between">
      <div>{left}</div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
};
