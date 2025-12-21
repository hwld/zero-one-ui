import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { ReactNode } from "react";
import { IconButton } from "./icon-button";
import { XIcon } from "lucide-react";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  action: ReactNode;
  width?: number;
};

export const Dialog: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  trigger,
  title,
  children,
  action,
  width = 320,
}) => {
  const isPresent = useIsPresent();
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange,
  });

  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    role,
    dismiss,
  ]);

  return (
    <>
      <Slot ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </Slot>
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && isPresent && (
            <FloatingOverlay lockScroll>
              <motion.div
                className="fixed inset-0 bg-black/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FloatingFocusManager context={context}>
                  <div
                    ref={refs.setFloating}
                    {...getFloatingProps()}
                    style={{ colorScheme: "dark" }}
                  >
                    <motion.div
                      className="fixed top-1/2 left-1/2 flex flex-col gap-2 rounded-lg border border-neutral-600 bg-neutral-800 p-4 text-neutral-100"
                      style={{ width }}
                      initial={{ x: "-50%", y: "-60%", opacity: 0 }}
                      animate={{ x: "-50%", y: "-50%", opacity: 1 }}
                      exit={{ x: "-50%", y: "-60%", opacity: 0 }}
                    >
                      <h2 className="text-lg font-bold">{title}</h2>
                      <div className="absolute top-2 right-2">
                        <IconButton
                          icon={XIcon}
                          onClick={() => onOpenChange(false)}
                        />
                      </div>
                      {children}
                      <div className="flex w-full justify-end gap-2">
                        {action}
                      </div>
                    </motion.div>
                  </div>
                </FloatingFocusManager>
              </motion.div>
            </FloatingOverlay>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
};
