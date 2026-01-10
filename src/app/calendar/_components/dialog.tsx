import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode } from "react";
import { TbX } from "@react-icons/all-files/tb/TbX";
import { IconButton } from "./button";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onChangeOpen: (open: boolean) => void;
};
export const Dialog: React.FC<Props> = ({ children, isOpen, onChangeOpen }) => {
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: onChangeOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePress: (event) => {
      if (!(event.target instanceof Element)) {
        return true;
      }
      return !event.target.closest("[data-toast]");
    },
  });

  const { getFloatingProps } = useInteractions([click, dismiss]);

  return (
    <AnimatePresence>
      {isOpen && (
        <FloatingPortal>
          <FloatingOverlay
            lockScroll
            className="z-50 bg-black/5"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <FloatingFocusManager context={context}>
              <div ref={refs.setFloating} {...getFloatingProps()}>
                <motion.div
                  className="fixed top-1/2 left-1/2 w-[470px] rounded-lg border border-neutral-300 bg-neutral-50 p-4 text-neutral-700 shadow-lg"
                  initial={{ x: "-50%", y: "-60%", opacity: 0 }}
                  animate={{ x: "-50%", y: "-50%", opacity: 1 }}
                  exit={{ x: "-50%", y: "-60%", opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  {children}
                </motion.div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </AnimatePresence>
  );
};

export const DialogContent: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <div className="flex flex-col gap-6">{children}</div>;
};

export const DialogTitle: React.FC<{
  children: string;
  onClose: () => void;
}> = ({ children, onClose }) => {
  return (
    <div className="flex justify-between gap-2">
      <div className="text-sm text-neutral-500 select-none">{children}</div>
      <div className="absolute top-2 right-2">
        <IconButton icon={TbX} onClick={onClose} />
      </div>
    </div>
  );
};

export const DialogAction: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <div className="flex gap-2 self-end">{children}</div>;
};
