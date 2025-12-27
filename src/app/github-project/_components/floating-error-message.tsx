import {
  autoUpdate,
  offset,
  useFloating,
  useMergeRefs,
} from "@floating-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, RefObject } from "react";
import { RefCallBack } from "react-hook-form";

type Props = {
  message?: string | undefined;
  messageId: string;
  offset?: number;
  anchorRef: RefObject<HTMLElement | null> | RefCallBack;
  anchor: ReactNode;
};

export const FloatingErrorMessage: React.FC<Props> = ({
  messageId,
  message,
  offset: _offset = 6,
  anchorRef,
  anchor,
}) => {
  const { refs, floatingStyles } = useFloating({
    open: !!message,
    placement: "top-start",
    middleware: [offset(_offset)],
    whileElementsMounted: autoUpdate,
  });

  const referenceRef = useMergeRefs([refs.setReference, anchorRef]);

  return (
    <>
      <Slot ref={referenceRef}>{anchor}</Slot>
      <AnimatePresence>
        {!!message && (
          <div ref={refs.setFloating} style={floatingStyles}>
            <motion.p
              id={messageId}
              className="rounded-sm bg-neutral-900 px-1 py-1 text-xs text-red-400"
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
            >
              {message}
            </motion.p>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
