import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";

export const NextMenuItem: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <motion.button
      layout="position"
      className="flex items-center gap-1 rounded-sm px-3 py-1 hover:bg-black/10"
      onClick={onClick}
    >
      <p className="text-sm">次へ</p>
      <ArrowRightIcon size={18} />
    </motion.button>
  );
};
