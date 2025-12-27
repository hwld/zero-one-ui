import { motion } from "motion/react";
import { ReactNode, forwardRef } from "react";

type Props = { children: ReactNode; width?: number };
export const DropdownCard = forwardRef<HTMLDivElement, Props>(function Card(
  { children, width = 200, ...props },
  ref,
) {
  return (
    <motion.div
      {...props}
      ref={ref}
      className="flex flex-col gap-2 rounded-lg border border-neutral-600 bg-neutral-800 py-2 text-neutral-200 shadow-2xl"
      initial={{ y: -5, opacity: 0, width }}
      animate={{ y: 0, opacity: 1, width }}
      exit={{ y: -5, opacity: 0, width }}
    >
      {children}
    </motion.div>
  );
});
