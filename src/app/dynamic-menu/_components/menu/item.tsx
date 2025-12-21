import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export const MenuItem: React.FC<{
  children: ReactNode;
  icon: LucideIcon;
  onClick?: () => void;
}> = ({ children, icon: Icon, onClick }) => {
  return (
    <motion.button
      layout="position"
      className="flex gap-1 rounded-sm p-2 transition-colors hover:bg-black/10"
      onClick={onClick}
    >
      <Icon />
      {children}
    </motion.button>
  );
};
