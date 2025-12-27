import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { AnimatePresence, MotionProps, motion } from "motion/react";
import { ReactNode } from "react";

type Position = "left" | "right";

type Props = {
  trigger: ReactNode;
  children: ReactNode;
  position?: Position;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};
export const Drawer: React.FC<Props> = ({
  trigger,
  children,
  position = "right",
  isOpen,
  onOpenChange,
}) => {
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getFloatingProps, getReferenceProps } = useInteractions([
    click,
    dismiss,
  ]);

  const positionClass = { left: "left-0", right: "right-0" };
  const animationClass = {
    left: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    right: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
  } as const satisfies Record<
    Position,
    {
      initial: MotionProps["initial"];
      animate: MotionProps["animate"];
      exit: MotionProps["exit"];
    }
  >;

  return (
    <>
      <Slot ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </Slot>
      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <FloatingOverlay lockScroll>
              <motion.div
                className="fixed inset-0 bg-black/50"
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
                      className={clsx(
                        "fixed top-0 bottom-0 m-2 flex w-[320px] flex-col overflow-hidden rounded-lg border border-neutral-600 bg-neutral-800 text-neutral-200",
                        positionClass[position],
                      )}
                      initial={animationClass[position].initial}
                      animate={animationClass[position].animate}
                      exit={animationClass[position].exit}
                    >
                      {children}
                    </motion.div>
                  </div>
                </FloatingFocusManager>
              </motion.div>
            </FloatingOverlay>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
};
