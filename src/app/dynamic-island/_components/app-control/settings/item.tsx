import { motion } from "framer-motion";
import { SmileIcon } from "lucide-react";

export const SettingItem: React.FC = () => {
  return (
    <motion.button
      layout
      className="flex w-full items-center gap-2 rounded-sm p-2 transition-colors hover:bg-white/20"
    >
      <SmileIcon />
      設定
    </motion.button>
  );
};
