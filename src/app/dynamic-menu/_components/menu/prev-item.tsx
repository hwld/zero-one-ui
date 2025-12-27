import { motion } from "motion/react";
import { ArrowLeftIcon } from "lucide-react";

export const PrevMenuItem: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <motion.button
      layout="position"
      className="flex items-center gap-1 px-2 py-1 hover:bg-black/10"
      onClick={onClick}
    >
      <ArrowLeftIcon size={18} />
      <p className="text-sm">戻る</p>
    </motion.button>
  );
};
