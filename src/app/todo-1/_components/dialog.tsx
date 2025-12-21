import { ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { LoaderCircleIcon, XIcon } from "lucide-react";

export const Dialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  titleText: string;
  cancelText: string;
  actionText: string;
  onAction: () => void;
  isActionPending?: boolean;
  children: ReactNode;
}> = ({
  isOpen,
  onOpenChange,
  titleText,
  cancelText,
  actionText,
  onAction,
  isActionPending = false,
  children,
}) => {
  const isPresent = useIsPresent();

  return (
    <RadixDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && isPresent && (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay asChild>
              <motion.div className="fixed inset-0 bg-black/15" />
            </RadixDialog.Overlay>

            <RadixDialog.Content asChild>
              <motion.div
                className="fixed top-1/2 left-1/2 flex min-h-[200px] w-[500px] max-w-[95%] flex-col overflow-hidden rounded-lg border border-neutral-300 bg-neutral-100 text-neutral-600"
                initial={{ opacity: 0, translateX: "-50%", translateY: "-50%" }}
                animate={{ opacity: 1, translateX: "-50%", translateY: "-40%" }}
                exit={{ opacity: 0, translateX: "-50%", translateY: "-50%" }}
              >
                <RadixDialog.Close asChild aria-label="閉じる">
                  <button className="absolute top-2 right-2 rounded-sm p-1 text-neutral-100 transition-colors hover:bg-white/20">
                    <XIcon />
                  </button>
                </RadixDialog.Close>
                <div className="bg-neutral-900 p-4 text-lg font-bold text-neutral-100">
                  {titleText}
                </div>
                <div className="grow p-4">{children}</div>
                <div className="flex justify-end gap-2 p-4">
                  <button
                    className="rounded-sm border border-neutral-300 px-3 py-2 text-sm transition-colors hover:bg-neutral-200"
                    onClick={() => onOpenChange(false)}
                  >
                    {cancelText}
                  </button>
                  <button
                    className="group relative overflow-hidden rounded-sm text-sm text-neutral-100 disabled:pointer-events-none"
                    onClick={onAction}
                    disabled={isActionPending}
                  >
                    <div
                      className={
                        "size-full bg-neutral-900 px-3 py-2 transition-opacity group-hover:bg-neutral-700 group-disabled:opacity-50"
                      }
                    >
                      {actionText}
                    </div>
                    <AnimatePresence>
                      {isActionPending && (
                        <motion.div
                          className="absolute inset-0 grid size-full place-items-center bg-black/50"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <LoaderCircleIcon className="size-5 animate-spin" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </motion.div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
};
