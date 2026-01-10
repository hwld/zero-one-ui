import { IconType } from "@react-icons/all-files";
import { PiCaretRightLight } from "@react-icons/all-files/pi/PiCaretRightLight";
import { motion } from "motion/react";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../../../../../lib/utils";

export const TreeToggleIconButton: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ isOpen, onOpenChange }) => {
  return (
    <IconButton onClick={() => onOpenChange(!isOpen)}>
      <motion.span animate={{ rotate: isOpen ? 90 : 0 }}>
        <Icon icon={PiCaretRightLight} />
      </motion.span>
    </IconButton>
  );
};

type IconButtonProps = ComponentPropsWithoutRef<"button">;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ children, className, ...props }, ref) {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          "grid size-6 place-items-center rounded-sm text-stone-700 transition-all hover:bg-black/5 hover:text-stone-900",
          className,
        )}
      >
        {children}
      </button>
    );
  },
);

export const Icon: React.FC<{ icon: IconType }> = ({ icon: Icon }) => {
  return <Icon className="size-4" />;
};
