import { AnimatePresence, motion } from "motion/react";
import { MenuTrigger } from "./trigger";
import { useState } from "react";
import {
  autoUpdate,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  offset,
} from "@floating-ui/react";
import { MenuContent } from "./content";

export const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState<1 | 2>(1);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (isOpen) => {
      setIsOpen(isOpen);
    },
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [offset(10)],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <MenuTrigger ref={refs.setReference} {...getReferenceProps()} />
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <MenuContent page={page} onPageChange={setPage} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
